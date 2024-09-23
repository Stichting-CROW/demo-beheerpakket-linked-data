import Button from '../Button/Button';

import './Modal.css';

interface ModalProps {
  primaryButtonHandler?: any;
  primaryButtonText?: any;
  secundaryButtonHandler?: any;
  secundaryButtonText?: any;
  children: any;
  style?: object;
}

const Modal = ({
  children,
  primaryButtonText,
  primaryButtonHandler,
  secundaryButtonText,
  secundaryButtonHandler,
  style
}: ModalProps) => {
  return (
    <div className="Modal" style={style}>

      <p>
        {children}
      </p>

      <div>
        {secundaryButtonHandler && <Button classes="Button-gray" onClick={secundaryButtonHandler}>
          {secundaryButtonText || 'Nee'}
        </Button>}

        <Button classes="Button-orange margin-left" onClick={primaryButtonHandler}>
          {primaryButtonText || 'Ja'}
        </Button>
      </div>

    </div>
  )
}

export default Modal;
