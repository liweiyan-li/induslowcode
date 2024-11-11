induslowcode/  
├── node_modules/          # npm 依赖包
├── public/                # 静态资源
│   ├── index.html         # 应用的主 HTML 文件
│   ├── favicon.ico        # 应用图标
│   └── assets/            # 其他静态资源（图片、字体等）
│
├── src/                   # 源代码
│   ├── lowCode/           # LowCodeEngine 页面相关
│   │   ├── index.js       # LowCodeEngine 主入口文件
│   │   ├── config.js      # LowCodeEngine 配置文件
│   │   └── components/     # LowCodeEngine 组件（如有）
│   │
│   ├── components/        # 应用的其他组件
│   │   └── ...            # 其他组件
│   │
│   ├── App.js             # 应用的主组件（包含 LowCodeEngine 页面）
│   ├── main.js            # Electron 主进程文件
│   └── preload.js         # 预加载脚本
│
├── config/                # 配置文件
│   ├── index.js           # 项目配置
│   └── ...                # 其他配置
│
├── package.json           # npm 配置文件
├── .gitignore             # git 忽略文件
└── README.md              # 项目说明文件



public/: 存放静态资源，比如 HTML 文件和其他静态文件。

index.html: 作为 Electron 应用的入口 HTML 文件，可以在这里加载 LowCodeEngine 的相关资源。

src/: 源代码目录，包含应用的主要逻辑。

lowCode/: 专门为 LowCodeEngine 页面创建的目录，包含 LowCodeEngine 的入口文件和配置文件。
index.js: 用于初始化和渲染 LowCodeEngine 页面。
config.js: 存放 LowCodeEngine 的相关配置，比如 API 地址、页面路由等。
components/: 如果有 LowCodeEngine 自定义组件，可以在这里存放。
components/: 其他通用组件，可以是应用的 UI 部分。
App.js: 应用的主组件，在这里可以引入并渲染 LowCodeEngine 的页面。
main.js: Electron 的主进程文件，负责应用的生命周期管理和窗口设置。
preload.js: 预加载脚本，用于安全地访问 Node.js 功能。

config/: 存放项目的配置文件，便于管理不同环境的配置。


package.json: 项目的 npm 配置文件，管理依赖和脚本。


.gitignore: 指定不需要提交到 git 的文件或目录。

依赖管理：确保将 LowCodeEngine 的依赖添加到 package.json 中，并正确安装。
安全性：在使用 Electron 时，请务必考虑应用的安全性，尽量关闭 Node.js 集成并使用上下文隔离。
开发模式与构建：在开发过程中使用 electron . 启动应用，完成后使用 electron-builder 进行打包和分发。


解决npm安装electron总失败的问题
npm install -g cnpm --registry=https://registry.npmmirror.com

cnpm install --save-dev electron


@written by: liweiyan 
@date: 2024-11-11
当前项目实现了打开一个文件夹并搜索其中的resourceList文件，并根据resourceList文件和schema文件渲染编辑器
需要注意的是我还没有实现删除页面时删除本地对应文件的功能，可能导致过期文件不能自动删除，建议在删除页面时手动删除本地文件。
后续可以在workspace的controller中添加删除文件的方法，并在删除页面时调用该方法。
当前资源文件共分为三类：
1. schema文件：用于描述页面结构的json文件
2. resourceList文件：用于描述页面资源的json文件
3. packages.json文件：用于描述页面依赖的json文件
目前实现了前两类文件的存取渲染，第三类文件在预览时使用，暂时没有实现存取渲染，后续可以添加。
文件命名逻辑为：
1. schema文件：场景名称scenarioName-页面id-projectSchema.json
2. resourceList文件：场景名称scenarioName-resourceList.json
暂时需要严格按照这个命名逻辑。原workspace中含有部分错误，已经发现的我已经在这个版本修改过了，预览的错误暂时没有改，等到实现预览功能时再实现。

注意：此版本打开的项目文件夹里只能有一个resourceList文件，当前针对单个项目进行管理。
**如有后续修改请写明修改位置及功能。**
**如有问题请联系我。**