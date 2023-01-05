import React from 'react';
import GLTFScene from './GLTF';
import OBJScene from './OBJ';
import FBXScene from './FBX';

export default ({ url, type = 'GLTF' }) => {
  if (type.toLowerCase() === 'gltf' || type.toLowerCase() === 'glb') {
    return <GLTFScene url={url}></GLTFScene>;
  } else if (type.toLowerCase() === 'obj') {
    return <OBJScene url={url}></OBJScene>;
  } else if (type.toLowerCase() === 'fbx') {
    return <FBXScene url={url}></FBXScene>;
  } else {
    // default 3d resource render
    return <GLTFScene url={url}></GLTFScene>;
  }
};
