# IndusLowCode

@written by: liweiyan   
@date: 2024-11-11

当前项目实现了打开一个文件夹并搜索其中的resourceList文件，并根据resourceList文件和schema文件渲染编辑器
需要注意的是我还没有实现删除页面时删除本地对应文件的功能，可能导致过期文件不能自动删除，建议在删除页面时手动删除本地文件。
后续可以在workspace的controller中添加删除文件的方法，并在删除页面时调用该方法。
### 当前资源文件共分为三类：
1. schema文件：用于描述页面结构的json文件
2. resourceList文件：用于描述页面资源的json文件
3. packages.json文件：用于描述页面依赖的json文件

目前实现了前两类文件的存取渲染，第三类文件在预览时使用，暂时没有实现存取渲染，后续可以添加。
### 文件命名逻辑为：
1. schema文件：场景名称scenarioName-页面id-projectSchema.json
2. resourceList文件：场景名称scenarioName-resourceList.json

暂时需要严格按照这个命名逻辑。原workspace中含有部分错误，已经发现的我已经在这个版本修改过了，预览的错误暂时没有改，等到实现预览功能时再实现。  
注意：此版本打开的项目文件夹里只能有一个resourceList文件，当前针对单个项目进行管理。

**如有后续修改请写明修改位置及功能。**  
**如有问题请联系我。**