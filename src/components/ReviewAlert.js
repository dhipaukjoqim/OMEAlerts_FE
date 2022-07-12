import React, {Component} from 'react';
import { List, Header, Form, Button, Segment, Dimmer, 
   Loader, Pagination, Dropdown, Modal, Icon } from 'semantic-ui-react'
import axios from "axios";

export default class ReviewAlert extends Component {
   constructor(props) {
     super(props);
     this.state = {
         user: "",
         alerts: [],
         loading: false,
         activePage: 1,
         totalPages: 1,
         subheaderOptions: [],
         headingOptions: [],
         modalOpen: false,
         submitHeaderDisabled: false,
         alertUpdationConfirmed: false,
         emailOptions: []
     }
   }

   componentDidMount = () => {
      let defaultSubheadingOptions = [
         { key: 'all option vants', value: 'all option vants', text: 'all option vants' },
         { key: 'mergers and acquisitions', value: 'mergers and acquisitions', text: 'mergers and acquisitions' },
         { key: 'covid 19', value: 'covid 19', text: 'covid 19' },
         { key: 'genevant', value: 'genevant', text: 'genevant' },
         { key: 'pharma ipo developments', value: 'pharma ipo developments', text: 'pharma ipo developments' },
         { key: 'mergers and acquisitions competitors', value: 'mergers and acquisitions competitors', text: 'mergers and acquisitions competitors' },
         { key: 'conferences', value: 'conferences', text: 'conferences' },
         { key: 'pharma regulatory updates', value: 'pharma regulatory updates', text: 'pharma regulatory updates' },
         { key: 'crl fda news', value: 'crl fda news', text: 'crl fda news' },
         { key: 'payer updates', value: 'payer updates', text: 'payer updates' },
         { key: 'pharma exec updates', value: 'pharma exec updates', text: 'pharma exec updates' },
         { key: 'elt gene therapy', value: 'elt gene therapy', text: 'elt gene therapy' },
         { key: 'masayuki rna activity', value: 'masayuki rna activity', text: 'masayuki rna activity' },
         { key: 'endometriosis news', value: 'endometriosis news', text: 'endometriosis news' },
         { key: 'uterine fibroids news', value: 'uterine fibroids news', text: 'uterine fibroids news' },
         { key: 'prostate cancer news', value: 'prostate cancer news', text: 'prostate cancer news' },
         { key: 'zanubrutinib news', value: 'zanubrutinib news', text: 'zanubrutinib news' },
         { key: 'jcr 141 news', value: 'jcr 141 news', text: 'jcr 141 news' },
         { key: 'bardoxolone methyl news', value: 'bardoxolone methyl news', text: 'bardoxolone methyl news' },
         { key: 'overactive bladder news', value: 'overactive bladder news', text: 'overactive bladder news' },
         { key: "women's health news", value: "women's health news", text: "women's health news" },
         { key: 'high priority news', value: 'high priority news', text: 'high priority news' },
         { key: 'tlr agonist updates', value: 'tlr agonist updates', text: 'tlr agonist updates' },
         { key: 'menin inhibitors updates', value: 'menin inhibitors updates', text: 'menin inhibitors updates' },
         { key: 'rna activity updates', value: 'rna activity updates', text: 'rna activity updates' },
         { key: 'cancer updates', value: 'cancer updates', text: 'cancer updates' },
         { key: 'protac updates', value: 'protac updates', text: 'protac updates' },
         { key: 'peptide activity updates', value: 'peptide activity updates', text: 'peptide activity updates' },
         { key: 'chk1 assets search', value: 'chk1 assets search', text: 'chk1 assets search' },
         { key: 'atr assets search', value: 'atr assets search', text: 'atr assets search' },
         { key: 'wee1 assets search', value: 'wee1 assets search', text: 'wee1 assets search' },
         { key: 'ccr8 assets search', value: 'ccr8 assets search', text: 'ccr8 assets search' },
         { key: 'wt1 assets search', value: 'wt1 assets search', text: 'wt1 assets search' },
         { key: 'ksp1007 updates', value: 'ksp1007 updates', text: 'ksp1007 updates' },
         { key: 'chk1-assets-search', value: 'chk1-assets-search', text: 'chk1-assets-search' },
         { key: 'ccr8-assets-search', value: 'ccr8-assets-search', text: 'ccr8-assets-search' },
         { key: 'wt1-assets-search', value: 'wt1-assets-search', text: 'wt1-assets-search' },
         { key: 'iga nephropathy updates', value: 'iga nephropathy updates', text: 'iga nephropathy updates' },
         { key: 'pfizer updates', value: 'pfizer updates', text: 'pfizer updates' },
         { key: 'bipolar disorder news alerts', value: 'bipolar disorder news alerts', text: 'bipolar disorder news alerts' },
         { key: 'epilepsy news alerts', value: 'epilepsy news alerts', text: 'epilepsy news alerts' },
         { key: "parkinson's disease news alerts", value: "parkinson's disease news alerts", text: "parkinson's disease news alerts" },
         { key: "schizophrenia news alerts", value: "schizophrenia news alerts", text: "schizophrenia news alerts"},
         { key: "historical related stories", value: "historical related stories", text: "historical related stories" },
         { key: "related stories | vector alerts", value: "related stories | vector alerts", text: "related stories | vector alerts" },
         { key: "academic-updates", value: "academic-updates", text: "academic-updates" },
         { key: "academic updates", value: "academic updates", text: "academic updates" },
      ]
      this.setState({
         subheaderOptions: defaultSubheadingOptions
      })
   }

   handlePaginationChange = async (e, { activePage }) => {
      console.log('activePage in handlepagination change', activePage)
      this.setState({ activePage })

      this.handleFetchAlerts();
    }

   handleInputChange = (e) => {
      this.setState({
        ...this.state,
        error: false,
        [e.target.name]: e.target.value
      })
   }

   handleFetchAlerts = () => {
      this.setState({
         loading: true
      }, async () => {
         const response = await axios
            .post('http://localhost:5000/alerts', this.state)
            .catch(err => {
               console.log("error in Axios request", err.message);
            })
            console.log("response", response)

         let preparedSubheadings = this.prepareSubheadingOptions(response.data.subheadings)
         let defaultSubheadingOptions = this.state.subheaderOptions;
         let updatedSubheadingOptions = defaultSubheadingOptions.concat(preparedSubheadings);
         
         let preparedHeadings = this.prepareHeadingOptions(response.data.headings);
         let emailOptions  = this.prepareEmailOptions(response.data.emails)

         this.setState({
            alerts: response.data.alerts,
            totalPages: response.data.count,
            subheaderOptions: updatedSubheadingOptions,
            headingOptions: preparedHeadings,
            emailOptions,
            loading: false
         })
      })
   }

   prepareEmailOptions = (emailOptions) => {
      let preparedEmailOptions = [];
      for(let option of emailOptions) {
         let object = {};
         object.key = option[0];
         object.text = option[0];
         object.value = option[0];

         if(option[0]!=null) preparedEmailOptions.push(object);
      }

      return preparedEmailOptions;
   }

   prepareSubheadingOptions = (subheadingOptions) => {
      let preparedSubheadinOptions = [];
      for(let option of subheadingOptions) {
         let object = {};
         object.key = option[0]
         object.text = option[0];
         object.value = option[0];

         if(option[0]!=null) preparedSubheadinOptions.push(object);
      }

      return preparedSubheadinOptions;
   }

   prepareHeadingOptions = (headingOptions) => {
      let preparedHeadingOptions = [];
      for(let option of headingOptions) {
         let object = {};
         object.key = option[0]
         object.text = option[0];
         object.value = option[0];

         if(option[0]!=null) preparedHeadingOptions.push(object);
      }

      return preparedHeadingOptions;
   }

   handleChange = (e, data) => {
      // console.log("i", data.name);
      // console.log("val", data.value);
      let alertsArray = this.state.alerts;
      alertsArray[data.name][3] = data.value;

      this.setState({
         alerts: alertsArray
      })
   }

   cleanDate = (date) => {
      let dateArray = date.split(" ")
      return dateArray.slice(0, 4);
   }

   handleModalOpen = () => {
      this.setState({
         modalOpen: true
      })
   }

   handleModalClose = () => {
      this.setState({
         modalOpen: false
      })
   }

   handleConfirmClick = async() => {
      //write to SQL with updated values of subheader and header
      this.setState({
         submitHeaderDisabled: true
      }, async() => {
         for(let alert of this.state.alerts) {
            const response = await axios
               .post('http://localhost:5000/update_alert', alert)
               .catch(err => {
                  console.log("error in Axios request", err.message);
               })
            console.log("response", response)
         }
         this.setState({
            modalOpen: false,
            alertUpdationConfirmed: true
         })
      })
   }

   handleConfirmationResponseModalClose = () => {
      this.setState({ alertUpdationConfirmed: false})
   }

   renderConfirmationResponseModal = () => {
      console.log("inside renderConfirmationResponseModal")
      return (
        <Modal
          open={this.state.alertUpdationConfirmed}
          onClose={this.handleConfirmationResponseModalClose}
          closeIcon
          size='small'
          >
            <Modal.Content>
              <h2 style={{ textAlign: 'center'}}>
                Alerts Updated! <Icon color="green" name="check circle" />
              </h2>
            </Modal.Content>
            <Modal.Actions>
            <Button onClick={() => this.handleConfirmationResponseModalClose()}>
              Close
            </Button>
          </Modal.Actions>
        </Modal>
      )
    }

   handleHeaderChange = (e, data) => {
      let alertsArray = this.state.alerts;

      let updatedAlerts = [];
      for(let alert of alertsArray) {
         alert[4] = data.value;
         updatedAlerts.push(alert)
      }

      this.setState({
         alerts: updatedAlerts
      })
   }

   handleEmailChange = (e, data) => {
      let alertsArray = this.state.alerts;

      let updatedAlerts = [];
      for(let alert of alertsArray) {
         alert[5] = data.value;
         updatedAlerts.push(alert)
      }

      this.setState({
         alerts: updatedAlerts
      })
   }

   handleHeadingAddition = (e, { value }) => {
      this.setState((prevState) => ({
        headingOptions: [{ text: value, value }, ...prevState.headingOptions],
      }))
   }

   handleEmailAddition = (e, { value }) => {
      this.setState((prevState) => ({
        emailOptions: [{ text: value, value }, ...prevState.emailOptions],
      }))
   }

   handleSubheaderAddition = (e, { value }) => {
      this.setState((prevState) => ({
        subheaderOptions: [{ text: value, value }, ...prevState.subheaderOptions],
      }))
   }

   render() {
      console.log("state in review alert", this.state);
      return (
         <div>
            {this.state.loading && (
               <Segment style={{ marginTop: '40px', height: '600px', marginRight: "50px", marginLeft: "50px"}}>
                  <Dimmer active inverted>
                     <Loader inverted content='Loading' />
                  </Dimmer>
              </Segment>
            )}
            {!this.state.loading && (
               <div style={{marginTop: "10px", marginLeft: "40px"}}>
                  <Header style={{ textAlign: "center", display: "inline" }}>
                     Review Alerts
                  </Header>
                  <Button 
                     primary 
                     style={{ marginLeft: "75%", marginTop: "20px" }}
                     onClick={() => {window.location.href="/"}}
                  >
                     Back
                  </Button>
                  <Pagination
                     style={{ marginTop: "10px" }} 
                     defaultActivePage={this.state.activePage} 
                     totalPages={this.state.totalPages} 
                     onPageChange={this.handlePaginationChange} 
                  />
                  <Form style={{ marginTop: "20px"}}>
                     <Form.Field inline>
                        <label><b>User</b></label>
                        <input
                           name="user"
                           style={{ marginLeft: "10px", minWidth: "200px"}} 
                           placeholder="Enter user"
                           onChange={this.handleInputChange}
                           value={this.state.user}
                        />
                        <Button 
                           style={{marginLeft: "30px"}} 
                           primary
                           onClick={this.handleFetchAlerts}
                        >
                           Fetch Alerts
                        </Button>

                        {/* Update header modal */}
                        <Modal
                           size='small'
                           closeIcon
                           trigger={<Button 
                              style={{float: "right", marginRight: "115px"}} 
                              primary
                           >
                              Save updates
                           </Button>}
                           onOpen={this.handleModalOpen}
                           onClose={this.handleModalClose}
                           open={this.state.modalOpen}
                        >
                           <Header content='Confirm grouping' />
                           <Modal.Content>
                           <Form>
                              <Form.Field inline>
                              <label style={{ marginRight: "77px"}}>Heading</label>
                              <Dropdown
                                 name= 'header'
                                 placeholder= 'Select header'
                                 selection
                                 search
                                 options={this.state.headingOptions} 
                                 onChange={this.handleHeaderChange}
                                 allowAdditions
                                 onAddItem={this.handleHeadingAddition}
                              />
                              </Form.Field>

                              <Form.Field inline>
                              <label style={{ marginRight: "77px"}}>Email</label>
                              <Dropdown
                                 name= 'email'
                                 placeholder= 'Select email'
                                 selection
                                 search
                                 options={this.state.emailOptions} 
                                 onChange={this.handleEmailChange}
                                 allowAdditions
                                 onAddItem={this.handleEmailAddition}
                              />
                              </Form.Field> 
                           </Form>
                           </Modal.Content>
                           <Modal.Actions>
                              <Button color='red' onClick={() => this.handleModalClose()}>
                                 <Icon name='remove' /> Cancel
                              </Button>
                              <Button color='green' disabled={this.state.submitHeaderDisabled} onClick={() => this.handleConfirmClick()}>
                                 <Icon name='checkmark' /> Confirm
                              </Button>
                           </Modal.Actions>
                        </Modal>
                        </Form.Field>
                  </Form>

                  <List divided relaxed style={{ marginTop: "40px"}}>
                     {this.state.alerts.map((item, i) => {
                        return (
                           <>
                              <List.Item key={i}>
                                 <List.Icon name='alarm' size='large' verticalAlign='middle' />
                                 <List.Content>
                                 <List.Header as='a'>{item[0]}</List.Header>
                                 <List.Description as='a'>{item[1]}</List.Description>
                                 <List.Description as='a'>{this.cleanDate(item[2])}</List.Description>
                                 </List.Content>
                              </List.Item>
                              <Dropdown
                                 style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "25px"}}
                                 name= {i}
                                 placeholder='Select subheader'  
                                 selection
                                 search
                                 options={this.state.subheaderOptions} 
                                 onChange={this.handleChange}
                                 value={item[3]}
                                 allowAdditions
                                 onAddItem={this.handleSubheaderAddition}
                              />
                           </>
                           
                        );
                     })}
                  </List>
                  <Pagination
                     style={{ marginTop: "10px", marginBottom: "30px" }} 
                     defaultActivePage={this.state.activePage} 
                     totalPages={this.state.totalPages} 
                     onPageChange={this.handlePaginationChange} 
                  />

                  {this.state.alertUpdationConfirmed && this.renderConfirmationResponseModal()}
               </div>
            )}
            
         </div>
      )
   }
}