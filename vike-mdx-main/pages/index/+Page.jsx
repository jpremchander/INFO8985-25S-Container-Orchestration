import React from 'react';

export default function(){
    React.useEffect(() => {
        window.location.href = "en";
      }, []);
    
    return <>Redirect to en</>
}