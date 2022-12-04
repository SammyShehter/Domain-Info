# Domain Info

Gathers info about domains. 
#### IMPORTANT : Make sure you've configured `.env` with relevant data. You can look at `.env.example`
<br>

## Getting started 
To initialize you need docker and docker-compose to be intalled:
```shellsession
$ docker-compose build && docker-compose up
```

This command will create 3 containers: 
- Backend
- Trigger App
- MongoDB

<br>

## Way to use: 
1. User sends POST request with desired domain
2. Trigger app scans domains scheduled by cronjob
3. User send GET request with domain to recieve info 


## Backend
### To add:
Now you need to populate db with some domains.
```HTTP
POST / HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 144

{"domain": "https://www.sammyshehter.com"}
```

_Cool feature_:  You can enter URL as is. no need for any edit

Make sure you use "domain" as a key and a valid URL 
Every entered domain recieves status: "not checked",
so if you'll try to gather info right away, you might be asked to wait

### To recieve
Query desired url. Can also be as is
```HTTP
GET /?domain=www.sammyshehter.com HTTP/1.1
Host: localhost:3000
```


## Trigger App
Runs over DB and gathers informaion for every unchecked domain.
After updates the entry and sets status to "checked"
Now user can see the info about the domain.

Uses Cronjob scheduled to run once in a month.
You can configure how often you want scan recieved domains. No need for restart
Just edit `./config.json`:

```json
{"cronTask": "* * * * *"}
```
