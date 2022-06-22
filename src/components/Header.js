import { Header } from 'semantic-ui-react'
import { Component } from 'react'

class HeaderContent extends Component {
    
  render() {
        return (
            <div>
                <Header style={{marginLeft: "20px", marginTop: "15px", textAlign: "center"}}>OME Alerts</Header>
            </div>
        );
    }
}

export default HeaderContent;