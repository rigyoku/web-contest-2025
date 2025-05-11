# 竞赛用项目

## 环境构筑

### 前言
* 依赖node环境, 需要自行安装
```sh
# 项目下执行, 安装依赖
npm i
```

### 启动ollama
```sh
# 依赖ollama环境, 需要自行安装
ollama run deepseek-r1:1.5b
```

### 配置env
```conf
# 例如
DATABASE_URL="mysql://root:root@localhost:30000/web_contest"
REDIS_URL="redis://localhost:30001"
JWT_SECRET="aqwrnqerfniq141b4r213414bve"
JWT_REFRESH_SECRET="nvopq49324bthwavkdaq34zlsav"
```

### 启动容器
```sh
# 依赖docker环境, 需要自行安装
# 启动容器
docker-compose -f web-contest-containers.yaml up -d

# 停止容器
# docker-compose -f web-docker-compose.yaml stop

# 停止并删除容器
# docker-compose -f web-docker-compose.yaml down
```

### 初始化mysql
```sql
# 竞赛用数据库
DROP DATABASE IF EXISTS `web_contest`;
CREATE DATABASE `web_contest`;

# meta 元数据表
CREATE TABLE `web_contest`.`meta` (
  `path` VARCHAR(100) NOT NULL,
  `title` VARCHAR(100) NULL,
  `description` VARCHAR(200) NULL,
  `keywords` VARCHAR(50) NULL,
  `icon` VARCHAR(200) NULL,
  PRIMARY KEY (`path`));
# 初始化测试数据
INSERT INTO `web_contest`.`meta` (`path`, `title`, `description`, `keywords`, `icon`) VALUES ('/', 'AI Box', 'AI工具导航集合平台赋能，引领产业升级新潮流。我们专注于AI绘画、AI游戏和AI视频等各大AI领域，提供最新最全的AI相关信息，包括AI工具软件、AI网址大全、AI热点资讯、AI学习图书等等。我们还提供免费AI软件教程，让您更轻松地掌握AI技术。我们致力于帮助AI爱好者实现自己的梦想，一起开创AI时代的未来！', 'AI导航,AI工具,AI工具集,AI工具箱,AI网址导航', '/logo-1.png');
# 清除数据
DELETE FROM `web_contest`.`meta` where path = '/';

# category 分类表
CREATE TABLE `web_contest`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(100) NULL,
  `icon` VARCHAR(200) NULL,
  `deleted` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);
# 初始化测试数据
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI编程开发', '/coding.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI游戏', '/game.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI医疗', '/hospital.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI教育', '/learn.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI图像工具', '/picture.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI社交', '/talk.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI视频处理', '/video.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI办公', '/work.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('AI写作', '/write.png', '/');
INSERT INTO `web_contest`.`category` (`name`, `icon`, `path`) VALUES ('其他AI工具', '/other.png', '/');

# item 项目表
CREATE TABLE `web_contest`.`item` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(100) NULL,
  `icon` VARCHAR(200) NULL,
  `link` VARCHAR(200) NOT NULL,
  `category_id` int NOT NULL,
  `deleted` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
);
# 初始化测试数据
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('Programming Helper', '只需键入文本说明即可生成代码。AI将为您创建代码', 'https://www.programming-helper.com/', '/ProgrammingHelper.svg', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('durable', '节省工作时间，让 Durable AI 在 30 秒内创建可创收的网站。 ', 'https://durable.co/', '/durable.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('Vivid', '使用 Vivid 的浏览器内可视化编辑器自动更新您的代码，让 CSS 样式变得轻而易举。', 'https://www.vivid.lol/?ref=aitoolbox.cn', '/vivid.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目1', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目2', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目3', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目4', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目5', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目6', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目7', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '1');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('Sensitivity Converter 鼠标灵敏度转换器', '支持多种游戏，轻松转换游戏鼠标灵敏度！。', 'https://sensitivity-converter.net/zh?ref=aitoolbox.cn', '/sensitivity.svg', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('convai', '对话式 AI API，用于语音识别、语言理解和生成，以及用于设计游戏和支持语音的应用程序的文本转语音。 ', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目1', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目2', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目3', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目4', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目5', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目6', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');
INSERT INTO `web_contest`.`item` (`name`, `description`, `link`, `icon`, `category_id`) VALUES ('占位项目7', '占位项目的描述', 'https://convai.com/?ref=aitoolbox.cn', '/logo-0.png', '2');



# 访问记录表
CREATE TABLE `web_contest`.`visit_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(100) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);
INSERT INTO `web_contest`.`visit_history` (`path`, `timestamp`) VALUES ('/', '2025-05-07 12:16:58');
INSERT INTO `web_contest`.`visit_history` (`path`, `timestamp`) VALUES ('/', '2025-05-06 12:16:58');
INSERT INTO `web_contest`.`visit_history` (`path`, `timestamp`) VALUES ('/', '2025-05-06 13:16:58');
INSERT INTO `web_contest`.`visit_history` (`path`, `timestamp`) VALUES ('/', '2025-05-06 14:16:58');
INSERT INTO `web_contest`.`visit_history` (`path`, `timestamp`) VALUES ('/', '2025-05-05 12:16:58');
INSERT INTO `web_contest`.`visit_history` (`path`, `timestamp`) VALUES ('/', '2025-05-05 13:16:58');
INSERT INTO `web_contest`.`visit_history` (`path`, `timestamp`) VALUES ('/', '2025-05-04 14:16:58');

# 点击记录表
CREATE TABLE `web_contest`.`click_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `relation_id` INT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);

# 用户表
CREATE TABLE `web_contest`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `mail` VARCHAR(200) NOT NULL,
  `roles` JSON NOT NULL,
  PRIMARY KEY (`id`)
);
# 密码可以通过脚本获得 node init-root-password.js
INSERT INTO `web_contest`.`user` (`username`, `password`, `mail`, `roles`) VALUES ('root', '$2b$10$7QfeNQGuWs.A2llCl31xsO17krij8DsX.fHmfHCYt68zckMFTJnyy', 'root@qq.com', '[1]');
INSERT INTO `web_contest`.`user` (`username`, `password`, `mail`, `roles`) VALUES ('admin', '$2b$10$7QfeNQGuWs.A2llCl31xsO17krij8DsX.fHmfHCYt68zckMFTJnyy', 'admin@qq.com', '[1]');

# 角色表
CREATE TABLE `web_contest`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(100) NULL,
  `permissions` JSON NOT NULL,
  PRIMARY KEY (`id`)
);
INSERT INTO `web_contest`.`role` (`name`, `description`, `permissions`) VALUES ('超级管理员', '运维人员使用', '[-1]');

# 权限表 (dba维护)
CREATE TABLE `web_contest`.`permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(100) NOT NULL, # 针对路径的权限
  `description` VARCHAR(100) NULL,
  `action` ENUM('no', 'read', 'write') NOT NULL DEFAULT 'no',
  PRIMARY KEY (`id`)
);

```

### prisma获取mysql结构
```sh
npm install prisma --save-dev

# 指定了数据库为mysql, 输出到../generated/prisma目录下
npx prisma init --datasource-provider mysql --output ../generated/prisma

# 拉取数据库结构到schema.prisma
npx prisma db pull

# 安装客户端
npm install @prisma/client

# 生成客户端
npx prisma generate
```

### 开发环境启动
```sh
npm run dev
```

### 生产环境打包启动
```sh
npm run build
npm run start
```

## 前端功能

### seo优化
* 通过ssr(服务端渲染), 不通过脚本就直接获取完整html
* 可以配置title, description, keywords, icon等元信息

### 多语
* 自动根据浏览器偏好重定向, 也可以手动切换
* 目前支持`zh`,`en`和`ja`三种语言

### 夜间模式
* 可以手动切换, 也会随着系统便好切换

### 用户获取最新内容
* 管理员更新内容后, 提示用户并自动完成无感刷新

## 后端功能

### 用户模块
* 可以登录和退出, app内部需要登录才能访问
* 可以修改用户名和密码
* 双token模式, 短token认证, 长token刷新
* 密码采用hash存储, 防止泄漏
* 记录登录时密码错误次数, 防止暴力破解密码
* 通过mail验证可以重置密码

### 首屏
* dashboard展示活跃用户数量, 点击数的统计等

### 权限管理模块 (/permission-management)
* rabc模式(基于角色的权限控制)

#### 角色管理 (/permission-management/user)
* 指定角色的权限

#### 用户管理 (/permission-management/role)
* 为用户分配角色

### 前端管理模块 (/front-management)

#### 元数据模块 (/front-management/meta)
* 设置页面的元信息

#### 元素模块 (/front-management/category)
* 设置前端展示的菜单和具体内容, 推送到客户端提示并刷新

#### 统计模块 (/front-management/statistics)
* 图表展示每个item的点击次数, 实时更新