/**
 * Used for getting the name of the mesh, based on its blender name
 * @param {*} name The mesh name
 * @returns The number of the object
 */
const getObjNum = (name) => {
  return parseInt(name.split("_")[1])
}

export default getObjNum
