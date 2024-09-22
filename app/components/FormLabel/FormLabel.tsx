import {useState} from 'react';
import {InfoButton, InfoContent} from '../InfoButton/InfoButton';

import './FormLabel.css';

interface FormLabelProps {
  id: string,
  label: string,
  children: any,
  infoText?: any
}

const FormLabel = ({
  id,
  label,
  children,
  infoText
}: FormLabelProps) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  return (
    <label htmlFor={id} className="FormLabel">
      <span className="FormLabel-label-wrapper">
        <span className="FormLabel-label">
          {label}
        </span>
        {infoText && <InfoButton isActive={isContentVisible} onClick={() => {
          setIsContentVisible(! isContentVisible)
        }} />}
      </span>
      <InfoContent isVisible={isContentVisible}>
        {infoText}
      </InfoContent>
      <div>
        {children}
      </div>
    </label>
  )
}

export default FormLabel;
