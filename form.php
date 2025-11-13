<?php
header('Content-Type: application/json');

$botToken = '8298467479:AAEFJo_-CnEADWnDupaLWdviyXQfwihkh7k';
$chatId = '517686543';

$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$city = trim($_POST['city'] ?? '');
$comment = trim($_POST['comment'] ?? '');

if (empty($name) || empty($phone) || empty($city)) {
    echo json_encode(['success' => false, 'message' => 'Заполните все обязательные поля']);
    exit;
}

try {
    $message = "📧 *НОВАЯ ЗАЯВКА С САЙТА*\n\n";
    $message .= "👤 *Имя:* $name\n";
    $message .= "📞 *Телефон:* $phone\n";
    $message .= "🏙️ *Город:* $city\n";
    $message .= "💬 *Комментарий:* " . ($comment ?: 'не указан') . "\n\n";

    $files = [];
    if (!empty($_FILES['files'])) {
        $fileCount = count($_FILES['files']['name']);
        $message .= "📎 *Прикреплено файлов:* $fileCount\n";

        for ($i = 0; $i < $fileCount; $i++) {
            if ($_FILES['files']['error'][$i] === UPLOAD_ERR_OK) {
                $files[] = [
                    'name' => $_FILES['files']['name'][$i],
                    'type' => $_FILES['files']['type'][$i],
                    'tmp_name' => $_FILES['files']['tmp_name'][$i],
                    'error' => $_FILES['files']['error'][$i],
                    'size' => $_FILES['files']['size'][$i]
                ];
            }
        }
    }

    $message .= "⏰ *Время:* " . date('d.m.Y H:i:s');

    $textSent = sendTelegramMessage($botToken, $chatId, $message);

    if (!$textSent) {
        throw new Exception('Ошибка отправки текстового сообщения в Telegram');
    }

    $filesSent = 0;
    if (!empty($files)) {
        if (count($files) === 1) {
            $file = $files[0];
            if (strpos($file['type'], 'image/') === 0) {
                $fileSent = sendTelegramPhoto($botToken, $chatId, $file);
            } else {
                $fileSent = sendTelegramDocument($botToken, $chatId, $file);
            }

            if ($fileSent) {
                $filesSent++;
            }
        } else {
            $filesSent = sendTelegramMediaGroup($botToken, $chatId, $files);
        }
    }

    echo json_encode([
        'success' => true,
        'message' => 'Заявка отправлена! Файлов отправлено: ' . $filesSent
    ]);
} catch (Exception $e) {
    error_log('Telegram error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки. Попробуйте позже.']);
}

function sendTelegramMessage($token, $chatId, $text)
{
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'Markdown'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200;
}

function sendTelegramPhoto($token, $chatId, $file)
{
    $url = "https://api.telegram.org/bot{$token}/sendPhoto";

    $postData = [
        'chat_id' => $chatId,
        'caption' => 'Фото из формы: ' . $file['name']
    ];

    $cfile = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
    $postData['photo'] = $cfile;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200;
}

function sendTelegramDocument($token, $chatId, $file)
{
    $url = "https://api.telegram.org/bot{$token}/sendDocument";

    $postData = [
        'chat_id' => $chatId,
        'caption' => 'Файл из формы: ' . $file['name']
    ];

    $cfile = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
    $postData['document'] = $cfile;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200;
}

function sendTelegramMediaGroup($token, $chatId, $files)
{
    $url = "https://api.telegram.org/bot{$token}/sendMediaGroup";

    $media = [];
    foreach ($files as $index => $file) {
        $mediaItem = [
            'type' => (strpos($file['type'], 'image/') === 0) ? 'photo' : 'document',
            'media' => 'attach://file_' . $index,
            'caption' => ($index === 0) ? 'Файлы из формы' : ''
        ];
        $media[] = $mediaItem;
    }

    $postData = [
        'chat_id' => $chatId,
        'media' => json_encode($media)
    ];

    foreach ($files as $index => $file) {
        $postData['file_' . $index] = new CURLFile($file['tmp_name'], $file['type'], $file['name']);
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode === 200 ? count($files) : 0;
}
