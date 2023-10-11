server {
    listen 80;
    server_name www.clundi.fr clundi.fr;

    location / {
        proxy_pass http://localhost:3000;  # Change the port if necessary
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
}
