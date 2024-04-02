import {CSSProperties} from 'react';

const CopyrightBar: React.FC = () => {
  const styles: {[key: string]: CSSProperties} = {
    bar: {
      backgroundColor: 'grey',
      color: 'white',
      padding: '10px',
      textAlign: 'center',
      bottom: '0',
      width: '100%',
    },
    text: {
      margin: '0',
    },
  };

  return (
    <div className="copyright-bar" style={styles.bar}>
      <p style={styles.text}>
        2023 - COOLTURED COLLECTIONS LLC. SINCE 2019 ALL RIGHT RESERVED
      </p>
    </div>
  );
};

export default CopyrightBar;
