import {getPhysicalObjects as getImborPhysicalObject} from './imbor';
import {getPhysicalObjects as getGwswPhysicalObject} from './gwsw';

export const getPhysicalObjects = async () => {
  const imbor_objects = await getImborPhysicalObject();
  const gwsw_objects = await getGwswPhysicalObject();

  // Merge both objects
  const merged = {
    head: imbor_objects.head,
    results: {
      bindings: [
        ...imbor_objects.results.bindings,
        ...gwsw_objects.results.bindings
      ]
    }
  }

  // And return
  return merged;
}
