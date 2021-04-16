# UslugeProfi
1. Склонировать проект
2. Установить все зависимости из файла requirements.txt
3. Создать базу данных postgres
4. В файле settings.py изменить имя базы данных, логин и пароль
5. Запустить тестовый сервер командой - python manage.py runserver

# Обновление сервера:
Папка с сервером: /home/develop/UslugeProfi/ 
1. git pull
2. sudo systemctl daemon-reload 
3. sudo systemctl restart gunicorn
4. sudo systemctl restart nginx
