import Button from '../Button';

import './Modal.css';

interface ModalProps {
  primaryButtonHandler?: any;
  secundaryButtonHandler?: any;
  children: any;
}

const Modal = ({
  children,
  primaryButtonHandler,
  secundaryButtonHandler
}: ModalProps) => {
  return (
    <div className="Modal">

      <p>
        {children}
      </p>

      <div >
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
