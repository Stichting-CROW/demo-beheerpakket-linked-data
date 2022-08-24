import {useState, useEffect, useRef} from 'react';
// import Button from './Button';

// Import helper functions
// import EditObject from './EditObject/EditObject'

import './ObjectList.css'

import type {Object} from '../../models/Object';

const objects: Object[] = [
  {
    label: '5G-antenne',
    uri: 'https://data.crow.nl/imbor/def/6f4ed3b6-6fcd-4816-b573-29b1d8dd69a7'
  },
  {
    label: 'Afvalbak',
    uri: 'https://data2.crow.nl/imbor/def/6f4ed3b6-6fcd-4816-b573-29b1d8dd69a7'
  },
]

const ObjectRow = ({data}) => {
  const something = () => {};

  return (
    <a onClick={something} className="ObjectRow">
      {data.label}
    </a>
  )
}

const ObjectList = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <div className="ObjectList">

      <h2>
        Objectenlijst
      </h2>

      <div>
        {objects.map(x => {
          return <ObjectRow key={x.uri} data={x} />
        })}
      </div>

    </div>
  )
}

export default ObjectList;
