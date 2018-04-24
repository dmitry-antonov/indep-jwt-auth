# Cross-site auth using JWT and CORS

### Table schema

```sql
CREATE TABLE `tbl_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

### Usage

```html
<div id="auth"></div>
<script src="http://authDomain.tld/script.js"></script>

```