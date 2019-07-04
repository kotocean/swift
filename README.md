# Swift 雨燕

> 首先，使用vue cli3安装quasar；然后，使用quasar cli命令启动和编译。

关联项目
+ [kotocean/sky](https://gitee.com/kotoceans/sky)

参考链接：
+ [quasar-framework components](https://quasar-framework.org/components/)
+ [spring-data-jpa](https://spring.io/projects/spring-data-jpa)
+ [Example setting env for dev/build](https://quasar.dev/quasar-cli/quasar-conf-js#Example-setting-env-for-dev%2Fbuild)

1. 开发启动命令 `quasar dev`;可以运行或编译时指定主题 ios/mat
2. 可以在启动时使用`quasar dev/build`的环境变量，如 `MY_API=api.com quasar build`,具体的配置示例为，

```
# then we pick it up in /quasar.conf.js
build: {
  env: ctx.dev
    ? { // so on dev we'll have
      API: JSON.stringify('https://dev.'+ process.env.MY_API)
    }
    : { // and on build (production):
      API: JSON.stringify('https://prod.'+ process.env.MY_API)
    }
}
```

3. HTML5 History模式下，后端的配置可参考[history-mode](https://router.vuejs.org/zh/guide/essentials/history-mode.html)。
4. Nginx配置为
```
location / {
  try_files $uri $uri/ /index.html;
}
```
> 当你使用 history 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id，也好看！
不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。
所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。

5. 使用quasar工具启动，如 `swift\dist\spa-mat> quasar serve --history -p 8082`