import Button from '../Button/Button';

import './Modal.css';

interface ModalProps {
  primaryButtonHandler?: any;
  secundaryButtonHandler?: any;
  children: any;
  style?: object;
}

const Modal = ({
  children,
  primaryButtonHandler,
  secundaryButtonHandler,
  style
}: ModalProps) => {
  return (
    <div className="Modal" style={style}>

      <p>
        {children}
      </p>

      <div>
        <Button classes="Button-gray" onClick={secundaryButtonHandler}>
          Nee
        </Button>

        <Button classes="Button-orange margin-left" onClick={primaryButtonHandler}>
          Ja
        </Button>
      </div>

    </div>
  )
}

export default Modal;
