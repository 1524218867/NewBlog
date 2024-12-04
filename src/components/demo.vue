#user nobody;
worker_processes 1;

#error_log logs/error.log;
#error_log logs/error.log notice;
#error_log logs/error.log info;

#pid logs/nginx.pid;

events {
worker_connections 1024;
}

http {
include mime.types;
default_type application/octet-stream;

# 加载各站点配置文件
#include C:/nginx-1.26.2/sites-available/*.conf;
server {
listen 80;
server_name ydqy.org.cn; # 你的域名

# 静态文件服务
location / {
root C:/nginx-1.26.2/html1/dist; # 前端打包文件路径，改为实际路径
index index.html index.htm;
try_files $uri $uri/ /index.html; # 确保前端路由支持
}

location /api/ {
proxy_pass http://127.0.0.1:3000; # 确保代理请求到后端服务的正确端口
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}



# 错误页面配置
error_page 500 502 503 504 /50x.html;
location = /50x.html {
root C:/path/to/your/frontend/dist; # 确保路径为前端文件的实际路径
}
}


#log_format main '$remote_addr - $remote_user [$time_local] "$request" '
# '$status $body_bytes_sent "$http_referer" '
# '"$http_user_agent" "$http_x_forwarded_for"';

#access_log logs/access.log main;

sendfile on;
#tcp_nopush on;

#keepalive_timeout 0;
keepalive_timeout 65;

#gzip on;

# 如果没有站点配置文件时，确保有默认的错误页面处理
error_page 500 502 503 504 /50x.html;
server{
location = /50x.html {

}


}

}