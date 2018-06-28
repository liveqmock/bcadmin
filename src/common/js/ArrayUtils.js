export default class ArrayUtils {
  constructor (key) {
    this.key = key
  }
  static setPermission (key, array) {
    let permissions = []
    for (let arr of array) {
      if (arr.privilegeVOs) {
        for (let p of arr.privilegeVOs) {
          permissions.push(p.path)
        }
      }
    }
    // 取出用户可访问的路径
    sessionStorage.setItem(key, JSON.stringify(permissions))
  }
  static hasPermission (path, userArr, allArr) {
    // path:用户访问的路径,userArr:用户菜单的路径集合，allArr:菜单的所有路径集合
    if (allArr && userArr && userArr.indexOf(path) < 0) {
      // 可以访问
      return false
    } else {
      return true
    }
  }

  /**
   * 角色管理如果存在三级目录，当三级目录下任意一个选项被勾选，需要将改选选项的父节点也提交
   * @param checkedArr 所有选中叶子结点的集合
   * @param baseArr 原始数据集合
   */
  static getThirdParents (checkedArr, baseArr) {
    let tempArr = []
    for (let c of checkedArr) {
      if (this.getThirdChildParent(c, baseArr)) {
        if (tempArr.indexOf(this.getThirdChildParent(c, baseArr)) === -1) {
          tempArr.push(this.getThirdChildParent(c, baseArr))
        }
      }
    }
    // 将tempArr元素的privilegeVOs设为空数组
    tempArr.forEach((val) => {
      val.privilegeVOs = []
    })
    return tempArr.concat(checkedArr)
  }

  /**
   * 如果item出于第三级几点，就返回他的父元素
   * @param item  选中的叶子结点
   * @param baseArr 原始数据集合
   * @returns {*}
   */
  static getThirdChildParent (item, baseArr) {
    if (!Array.isArray(baseArr)) return null
    for (let first of baseArr) {
      for (let second of first.privilegeVOs) {
        if (second.privilegeVOs && second.privilegeVOs.length > 0) {
          for (let third of second.privilegeVOs) {
            if (item === third) {
              return second
            }
          }
        }
      }
    }
    return null
  }
}
