import './SourceLabel.css';

const SourceLabel = ({children}: {children: string}) => {
  return <>
    <a
      href={children} target="_blank" rel="external"
      className="SourceLabel block rounded p-2 my-2 text-xs"
    >
      {children}
    </a>
  </>
}

export default SourceLabel;
