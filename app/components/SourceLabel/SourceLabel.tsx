import './SourceLabel.css';

const SourceLabel = ({children}: {children: string}) => {
  return <>
    <a
      href={children} target="_blank" rel="external"
      className="SourceLabel block rounded p-2 py-1 my-3"
    >
      {children}
    </a>
  </>
}

export default SourceLabel;
