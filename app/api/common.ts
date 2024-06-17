import {getPhysicalObjects as getImborPhysicalObject} from './imbor';
import {getPhysicalObjects as getGwswPhysicalObject} from './gwsw';

import {getAttributesForClass as getImborAttributesForClass} from './imbor';
import {getAttributesForClass as getGwswAttributesForClass} from './gwsw';

import {getEnumsForAttribute as getImborEnumsForAttribute} from './imbor';

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

export const getAttributesForClass = async (classUri: string) => {
  const imbor_attributes = await getImborAttributesForClass(classUri);
  const gwsw_attributes = await getGwswAttributesForClass(classUri);

  // Merge both objects
  const merged = {
    head: imbor_attributes.head,
    results: {
      bindings: [
        ...imbor_attributes.results.bindings,
        ...gwsw_attributes.results.bindings
      ]
    }
  }

  // And return
  return merged;
}

export const getEnumsForAttribute = async (attributeUri: string) => {
  const imbor_enums = await getImborEnumsForAttribute(attributeUri);

  // Merge both objects
  const merged = imbor_enums;

  // And return
  return merged;
}
