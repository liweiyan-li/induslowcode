import { IPublicModelPluginContext, IPublicResourceData } from '@alilc/lowcode-types';
import { getResourceListFromLocalStorage, setResourceListToLocalStorage } from '../../services/mockService';



// 修改插件，使其支持在注册时传入 pageList
export function pluginResourceData(ctx: IPublicModelPluginContext, pageList: { title: string; slug: string; id: string }[]) {
  const { workspace } = ctx;

  function updateResourceList(list: { title: string; slug: string }[]) {
    workspace.setResourceList([
      ...list.map((d) => ({
        resourceName: 'page',
        title: d.title,
        id: d.slug,
        category: '页面',
        config: {},
        options: {
          title: d.title,
          slug: d.slug,
          id: d.slug,
        },
      } as IPublicResourceData)),
    ]);
  }

  return {
    exports() {
      const scenarioName = ctx.config.get('scenarioName');
      return {
        update(list: { title: string; slug: string }[]) {
          setResourceListToLocalStorage(scenarioName, list);
          updateResourceList(list);
        },
      };
    },
    async init() {
      const scenarioName = ctx.config.get('scenarioName');
      let finalPageList = pageList;
      if(pageList){
        //  finalPageList = ensureArray(pageList);
         finalPageList = JSON.parse(pageList) as any[]
      }
      else{
        console.log('pageList is null');
      }
      // 如果传入了 pageList，直接使用它；否则从本地存储获取
      // const finalPageList = pageList || await getResourceListFromLocalStorage(scenarioName);
      console.log('finalPageList', finalPageList);
      setResourceListToLocalStorage(scenarioName, finalPageList);

      updateResourceList(finalPageList);
    },
  };
}

pluginResourceData.pluginName = 'pluginResourceData';

export default pluginResourceData;
