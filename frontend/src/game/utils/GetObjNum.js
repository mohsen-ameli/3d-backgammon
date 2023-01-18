/**
 * -> Used for getting the name of the mesh, based on its blender name
 * Used for column names
 * @param {*} name
 * @returns
 */
const getObjNum = (name) => {
  return parseInt(name.split("_")[1])
}

export default getObjNum
