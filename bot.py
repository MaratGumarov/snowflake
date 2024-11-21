import os
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# Загрузка переменных окружения из файла .env
load_dotenv()

# Получение токена из переменной окружения
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
NGROK_WEB_APP_URL = os.getenv('NGROK_WEB_APP_URL')

# Проверка, что токен и URL доступны
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN не найден. Пожалуйста, добавьте его в файл .env")
if not NGROK_WEB_APP_URL:
    raise ValueError("NGROK_WEB_APP_URL не найден. Пожалуйста, добавьте его в файл .env")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    try:
        # Создание кнопки с Web App
        keyboard = [
            [InlineKeyboardButton("Play Tap Game", web_app=WebAppInfo(url=NGROK_WEB_APP_URL))]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        # Отправка сообщения с кнопкой
        await update.message.reply_text('Click below to play:', reply_markup=reply_markup)
        print(f"Отправлено сообщение пользователю {update.effective_user.id}")  # Лог для отладки
    except Exception as e:
        print(f"Ошибка при отправке сообщения: {e}")  # Лог ошибок для отладки

def main() -> None:
    # Создание объекта приложения
    application = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()

    # Регистрация обработчика команды /start
    application.add_handler(CommandHandler("start", start))
    print("Команда /start зарегистрирована.")  # Лог для отладки

    # Запуск бота и ожидание событий
    application.run_polling()
    print("Бот успешно запущен и подключен к Telegram.")  # Лог для отладки

if __name__ == '__main__':
    main()
