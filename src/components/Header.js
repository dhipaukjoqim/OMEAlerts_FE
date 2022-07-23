import { Header, Button } from 'semantic-ui-react'
import { Component } from 'react'

class HeaderContent extends Component {
    
    render() {
        return (
            <div style={{ display: "inline" }}>
                <Header 
                    style={{marginTop: "80px", textAlign: "center", display: "inline" }}
                >
                    OME Alerts
                </Header>
                <Button 
                    primary 
                    style={{ marginLeft: "71%", marginTop: "20px" }}
                    onClick={() => {window.location.href="/review"}}
                >
                    Review Alerts
                </Button>
            </div>
        );
    }
}

export default HeaderContent;