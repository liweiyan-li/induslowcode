
function showSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
}

function showEditor() {
    const editor = document.getElementById('editor');
    editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
}

function showToolbox() {
    const toolbox = document.getElementById('toolbox');
    toolbox.style.display = toolbox.style.display === 'none' ? 'block' : 'none';
}

function addModule() {
    alert('新增模块');
}

function addEntity() {
    alert('新增实体');
}

function addPage() {
    alert('新增页面');
}

function addMicroflow() {
    alert('新增微流');
}

function addComponent() {
    alert('添加组件');
}

function editComponent() {
    alert('编辑组件');
}
// 渲染文件夹目录结构
function renderFolderTree(folderContents, parentElement) {
    folderContents.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.classList.add('sub-module-item');
        itemElement.textContent = item.name;

        if (item.type === 'directory') {
            itemElement.classList.add('folder-item');
            const subList = document.createElement('ul');
            subList.classList.add('sub-sub-module-list');
            renderFolderTree(item.children, subList);
            itemElement.appendChild(subList);

            itemElement.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleTree(itemElement);
            });
        }
        parentElement.appendChild(itemElement);
    });
}

// 控制树状结构的展开和折叠
function toggleTree(element) {
    console.log('toggleTree',element);
    const subModuleList = element.querySelector('ul');
    if (subModuleList) {
        subModuleList.style.display = subModuleList.style.display === 'block' ? 'none' : 'block';
    }
}

const handleFolderContents = (folderContents) => {
    console.log('handleFolderContents',folderContents);
    const folderContentsElement = document.getElementById('folderContents');
    folderContentsElement.innerHTML = '';
    renderFolderTree(folderContents, folderContentsElement);
};

  
  window.electronAPI1.onFolderContents((event, folderContents) => {
    
    console.log(folderContents);
    handleFolderContents(folderContents);
});

// console.log(folderContents);
// handleFolderContents(folderContents);