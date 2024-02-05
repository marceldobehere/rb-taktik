mkdir data/ssl -p

# Change this to your domain
mkdir -p /rb-taktik/data/ssl
cp /etc/letsencrypt/live/rb-taktik.marceldobehere.com/fullchain.pem ./rb-taktik/data/ssl/cert.pem
cp /etc/letsencrypt/live/rb-taktik.marceldobehere.com/privkey.pem ./rb-taktik/data/ssl/key.pem


cd rb-taktik
exec node index.js -https