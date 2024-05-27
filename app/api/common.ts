import {getPhysicalObjects as getImborPhysicalObject} from './imbor';
import {getPhysicalObjects as getGwswPhysicalObject} from './gwsw';

export const getPhysicalObjects = async () => {
  const imbor_objects = await getImborPhysicalObject();
  const gwsw_objects = await getGwswPhysicalObject();

  // Merge both objects
  imbor_objects.merge(gwsw_objects);

  // And return
  return gwsw_objects;
}
