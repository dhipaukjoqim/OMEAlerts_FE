import React from 'react'
import { Button, Modal, Icon, Header, Form, Select, Divider } from 'semantic-ui-react'
import uuid from 'react-uuid'

class SourceLinkModal extends React.Component {
    state = {
        sourceLinkModalOpen: false,
        includeSourceLinks: [
            {
                uuid: uuid(),
                val: ""
            }
        ],
        excludeSourceLinks: [
            {
                uuid: uuid(),
                val: ""
            }
        ],
        options: []
    };

    handleSourceLinkModalClose = () => { this.setState({ sourceLinkModalOpen: false })}
    handleSourceLinkModalOpen = () => {
        this.setState({ 
            sourceLinkModalOpen: true,
            options: this.props.options
        })
    }

    handleSourceLinkModalSubmit = () => {
        console.log("inside handleSourceLinkModalSubmit")
        let includeLinks = [];
        let excludeLinks = [];

        for(let elem of this.state.includeSourceLinks) {
            includeLinks.push(elem.val);
        }

        for(let elem of this.state.excludeSourceLinks) {
            excludeLinks.push(elem.val);
        }

        this.props.parentCallback(includeLinks, excludeLinks);

        this.setState({
            sourceLinkModalOpen: false
        })

    }

    addIncludeLink = () => {
        let linkObj = {};
        linkObj.uuid = uuid();
        linkObj.val = "";
        let givenLinks = this.state.includeSourceLinks;
        givenLinks.push(linkObj);
        console.log("givenLinks", givenLinks)
        this.setState({
            includeSourceLinks: givenLinks
        })
    }

    addExcludeLink = () => {
        let linkObj = {};
        linkObj.uuid = uuid();
        linkObj.val = "";
        let givenLinks = this.state.excludeSourceLinks;
        givenLinks.push(linkObj);
        console.log("givenLinks", givenLinks)
        this.setState({
            excludeSourceLinks: givenLinks
        })
    }

    handleIncludeSourceLinkChange = key => (e, data) => {
        let givenIncludeSourceLinkArray = this.state.includeSourceLinks;
        for(let elem of givenIncludeSourceLinkArray) {
            if(elem.uuid === key) {
                elem.val = data.value
            }
        }

        this.setState({
            includeSourceLinks: givenIncludeSourceLinkArray
        })
    }

    handleExcludeSourceLinkChange = key => (e, data) => {
        let givenExcludeSourceLinkArray = this.state.excludeSourceLinks;
        for(let elem of givenExcludeSourceLinkArray) {
            if(elem.uuid === key) {
                elem.val = data.value
            }
        }

        this.setState({
            excludeSourceLinks: givenExcludeSourceLinkArray
        })
    }
    
  
    handleDeleteIncludeLink = (key) => {
        let existingIncludeSourceLink = this.state.includeSourceLinks;

        for(let elem of existingIncludeSourceLink) {
            if(elem.uuid === key) {
                let idx = existingIncludeSourceLink.indexOf(elem);
                existingIncludeSourceLink.splice(idx, 1);
            }
        }

        this.setState({
            ...this.state,
            includeSourceLinks: existingIncludeSourceLink
        })
    }

    handleDeleteExcludeLink = (key) => {
        let existingExcludeSourceLink = this.state.excludeSourceLinks;

        for(let elem of existingExcludeSourceLink) {
            if(elem.uuid === key) {
                let idx = existingExcludeSourceLink.indexOf(elem);
                existingExcludeSourceLink.splice(idx, 1);
            }
        }

        this.setState({
            ...this.state,
            excludeSourceLinks: existingExcludeSourceLink
        })
    }

    render() {
        console.log("source link modal state", this.state)
        let includeSourceLinks = this.state.includeSourceLinks;
        let excludeSourceLinks = this.state.excludeSourceLinks;
        return (
            <Modal
                size='small'
                closeIcon
                trigger={<Button style={{ marginTop: "25px"}}>Source link</Button>}
                onOpen={this.handleSourceLinkModalOpen}
                onClose={this.handleSourceLinkModalClose}
                open={this.state.sourceLinkModalOpen}
            >
                
            <Header content='Source link' />
                <Modal.Content>
                <div style={{ display: 'inline'}}>
                    <Header style={{ display: 'inline'}} as='h4'>INCLUDE</Header>
                    <Icon 
                        style={{ cursor: 'pointer', display: 'inline', marginLeft: "10px", marginBottom: "5px"}} 
                        name="plus circle" 
                        color="green" 
                        size="large"
                        onClick={this.addIncludeLink}
                    />
                </div>
                <Form style={{ marginBottom: "20px", marginTop: "10px"}}>
                {includeSourceLinks.length > 0 && 
                    includeSourceLinks.map(({ uuid, val }) => (
                    <Form.Field inline key={uuid}>
                        <label ><b>Source Link</b></label>
                        <Select
                            style={{ minWidth: "385px"}}
                            placeholder='Select source link'
                            name = 'sourceLink'
                            value={val}
                            options={this.state.options}
                            onChange={this.handleIncludeSourceLinkChange(uuid)}                                    
                            search
                        />
                        <Icon
                            //onClick={()=>{this.setState((includeSourceLinks)=>[...includeSourceLinks].splice(key, 1))}}
                            onClick={() => this.handleDeleteIncludeLink(uuid)}
                            style={{ display: 'inline', marginLeft: "10px",  cursor: 'pointer'}}
                            name="minus circle" 
                            color="red"
                            size="large"
                        />
                    </Form.Field>
                    ))
                }
                </Form>

                <Divider style={{ marginTop: "50px"}}/>

                <div style={{ display: 'inline'}}>
                    <Header style={{ display: 'inline'}} as='h4'>EXCLUDE</Header>
                    <Icon 
                        style={{ cursor: 'pointer', display: 'inline', marginLeft: "10px", marginBottom: "5px"}} 
                        name="plus circle" 
                        color="green" 
                        size="large"
                        onClick={this.addExcludeLink}
                    />
                </div>
                <Form style={{ marginBottom: "20px", marginTop: "10px"}}>
                {excludeSourceLinks.length > 0 && 
                    excludeSourceLinks.map(({ uuid, val }) => (
                    <Form.Field inline key={uuid}>
                        <label ><b>Source Link</b></label>
                        <Select
                            style={{ minWidth: "385px"}}
                            placeholder='Select source link'
                            name = 'sourceLink'
                            value={val}
                            options={this.state.options}
                            onChange={this.handleExcludeSourceLinkChange(uuid)}                                    
                            search
                        />
                        <Icon
                            onClick={() => this.handleDeleteExcludeLink(uuid)}
                            style={{ display: 'inline', marginLeft: "10px",  cursor: 'pointer'}}
                            name="minus circle" 
                            color="red"
                            size="large"
                        />
                    </Form.Field>
                    ))
                }
                </Form>

                </Modal.Content>
                <Modal.Actions>
                <Button color='green' onClick={this.handleSourceLinkModalSubmit}>
                    <Icon name='checkmark' /> OK
                </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default SourceLinkModal;