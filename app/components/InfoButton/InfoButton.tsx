import './InfoButton.css';

interface InfoButtonProps {
  isActive?: boolean,
  onClick?: any
}

interface InfoContentProps {
  children: any,
  isVisible: boolean
}

const InfoButton = ({
  isActive,
  onClick
}: InfoButtonProps) => {
  return (
    <div className="InfoButton" onClick={onClick}>
      <div className={`InfoButton-button ${isActive ? 'is-active' : ''}`}>
        ℹ️
      </div>
    </div>
  )
}

const InfoContent = ({
  children,
  isVisible
}: InfoContentProps) => {
  return (
    <div className={`InfoButton-content ${isVisible ? 'visible' : 'hidden'}`}>
      {children}
    </div>
  )
}

export {
  InfoButton,
  InfoContent
}
