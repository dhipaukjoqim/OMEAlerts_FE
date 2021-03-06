import React, {Component} from 'react';
import { Grid, Header, Icon, Select, Form, Button, Modal, Input, Radio, 
   TextArea, Popup, Segment, Divider, Dropdown, Dimmer, Loader } from 'semantic-ui-react'
import axios from "axios";
import SourceLinkModal from './modals/SourceLinkModal';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
const _ = require("lodash");

export default class EditAlert extends Component {
   constructor(props) {
     super(props);
     this.state = {
         omeId: "",
         loading: false,
         alert: [],
         modalOpen: false,
         sectionModalOpen: false,
         AutomationModalOpen: false,
         sourceLinkModalOpen: false,
         alertDate: null,
         keywords: [],
         aliases: [],
         lemmapp: "",
         searchtype: "",
         sourceClass: "",
         user: "",
         emailAlert: true,
         summary: false,
         relstories: false,
         hisrelstories: false,
         trendnews: false,
         synrel: false,
         mddar: false,
         irrtextrem: false,
         marelmat: false,
         alertTitle: "",
         alertDate: "",
         sourceClassOptions: [],
         sourceLinkOptions: [],
         negsearchbool: "",
         aliaslem: "",
         senWoNegBool: false,
         negalias: "",
         negaliaslemm: "",
         sourceLink: "",
         alertCreationConfirmed: false,
         createClicked: false,
         error: false,
         keywordOptions: [],
         aliasesOptions: [],
         loading: false,
         includeLinks: [],
         excludeLinks: [],
         emailSubject: "",
         subheadingOptions: [],
         subheader: "",
         subheaderOrder: "",
         header: "",
         headingOptions: [],
         recepientList: "",
         frequency: [],
         frequencyOptions: []
     }
   }

   componentDidMount = () => {
      let omeId = this.props.match.params.id;
      this.setState({
         omeId,
         loading: true
      }, async() => {
         let response = await axios
         .post('http://localhost:5000/alert', this.state)
         .catch(err => {
            console.log("error in Axios request", err.message);
         })
         console.log("response", response)
         let alert = response.data.alert[0];
         let keywords = alert[7].split(',');

         let currentKeywordOptions = this.state.keywordOptions;
         for(let key of keywords) {
            let obj = {};
            obj.key = key;
            obj.text = key;
            obj.value = key
            currentKeywordOptions.push(obj)
         }
         console.log("currentKeywordOptions", currentKeywordOptions)
         
         let aliases = alert[8].split(',')
         let currentAliasesOptions = this.state.aliasesOptions;
         for(let alias of aliases) {
            let obj = {};
            obj.key = alias;
            obj.text = alias;
            obj.value = alias
            currentAliasesOptions.push(obj)
         }

         let searchtype = alert[9];
         let sourceClass = alert[10];
         let user = alert[11];
         let emailAlert = alert[12];
         if (emailAlert == "yes") {
            emailAlert= true
         } else {
            emailAlert = false
         }

         let alertTitle = alert[13];
         let alertDate = moment(alert[2]);
         alertDate = alertDate.toISOString().split('T')[0];
         console.log("alertDate", alertDate);

         let lemmapp = alert[13];
         let summary = alert[14];
         if (summary == 1)
            summary = true;
         else 
            summary= false;
         
         let relstories = alert[15];
         if (relstories == 1)
            relstories = true;
         else 
            relstories= false;

         let hisrelstories = alert[16];
         if (hisrelstories == 1)
            hisrelstories = true;
         else 
            hisrelstories= false;

         let trendnews = alert[17];
         if (trendnews == 1)
            trendnews = true;
         else 
            trendnews= false;

         let synrel = alert[18];
         if (synrel == 1)
            synrel = true;
         else 
            synrel= false;

         let mddar = alert[19];
         if (mddar == 1)
            mddar = true;
         else 
            mddar= false;
         
         let irrtextrem = alert[20];
         if (irrtextrem == 1)
            irrtextrem = true;
         else 
            irrtextrem= false;

         let marelmat = alert[21];
         if (marelmat == 1)
            marelmat = true;
         else 
            marelmat= false;
         
         let aliaslem = alert[22];
         let negalias = alert[23];
         let negsearchbool = alert[24];
         let negaliaslemm = alert[25];
         let senWoNegBool = alert[26];
         if (senWoNegBool == "yes")
            senWoNegBool = true
         else
            senWoNegBool = false

         let emailSubject = alert[27];
         let header = alert[28];
         let subheader = alert[29];
         let subheaderOrder = alert[30];
         let frequency = alert[31];
         if(frequency.split(',').length==1) {
            frequency = [frequency]
         }
         let recepientList = alert[32];

         this.setState({
            alert,
            keywords,
            aliases,
            searchtype,
            sourceClass,
            user,
            emailAlert,
            alertTitle,
            alertDate,
            lemmapp,
            summary,
            relstories,
            hisrelstories,
            trendnews,
            synrel,
            mddar,
            irrtextrem,
            marelmat,
            aliaslem,
            negalias,
            negsearchbool,
            negaliaslemm,
            senWoNegBool,
            emailSubject,
            header,
            subheader,
            subheaderOrder,
            frequency,
            recepientList,
            keywordOptions: currentKeywordOptions,
            aliasesOptions: currentAliasesOptions
         }, async() => {
            response = await axios
               .get('http://localhost:5000/keys')
               .catch(err => {
                  console.log("error in Axios request", err.message);
               })
               
               const givenAliases = response.data.aliases;
               const givenKeywords = response.data.keywords;
               const givenSubHeadings = response.data.subheadings;
               const givenHeadings = response.data.headings;
         
               let preparedAliases = [];
               let preparedKeywords = [];
         
               //every alias value in MySQL is a combination of aliases seperated by commas, so splitting them and pushing them into a seperate array
               for(let alias of givenAliases) {
                 if(alias[0]!=null) {
                   let aliasElementArray = alias[0].split(',');
                   for (let elem of aliasElementArray) {
                     preparedAliases.push(elem);
                   }  
                 }
               }
               preparedAliases = _.uniq(preparedAliases);
         
               for(let key of givenKeywords) {
                 if(key[0]!=null) {
                     let keyElementArray = key[0].split(',');
                     for (let elem of keyElementArray) {
                     preparedKeywords.push(elem);
                     }  
                 }
               }
               preparedKeywords = _.uniq(preparedKeywords);
         
               let aliasesOptions = this.state.aliasesOptions;
               for(let i=0; i<preparedAliases.length; i++) {
                 let object = {};
                 object.key = i;
                 object.text = preparedAliases[i];
                 object.value = preparedAliases[i];
                 aliasesOptions.push(object)
               }
         
               let keywordOptions = this.state.keywordOptions;
               for(let i=0; i<preparedKeywords.length; i++) {
                 let object = {};
                 object.key = i;
                 object.text = preparedKeywords[i];
                 object.value = preparedKeywords[i];
                 keywordOptions.push(object)
               }
         
               let subheadingsOptions = [];
               for(let sub of givenSubHeadings) {
                 let obj = {};
                 obj.key = sub[0];
                 obj.text = sub[0];
                 obj.value = sub[0];
         
                 subheadingsOptions.push(obj)
               }
         
               let headingOptions = [];
               for(let sub of givenHeadings) {
                 let obj = {};
                 obj.key = sub[0];
                 obj.text = sub[0];
                 obj.value = sub[0];
         
                 headingOptions.push(obj)
               }

               const sourceClassOptions = [
                  { key: 'all', value: 'all', text: 'ALL' },
                  { key: 'pr', value: 'Press releases', text: 'Press releases' },
                  { key: 'pmabs', value: 'Pub_Med Abstracts', text: 'Pub_Med Abstracts' },
                  { key: 'pmctext', value: 'PMC_text', text: 'PMC_text' }
               ];
         
               this.setState({
                 ...this.state,
                 keywordOptions,
                 aliasesOptions,
                 subheadingOptions: subheadingsOptions,
                 headingOptions,
                 sourceClassOptions,
                 loading: false
               }, async () => {
                  //reading csv contents from public/data/link.csv
                  const optionsData = await this.fetchCsv();
                  const frequencyOptions = [
                     { key: 'Monday', value: 'Monday', text: 'Monday' },
                     { key: 'Tuesday', value: 'Tuesday', text: 'Tuesday' },
                     { key: 'Wednesday', value: 'Wednesday', text: 'Wednesday' },
                     { key: 'Thursday', value: 'Thursday', text: 'Thursday' },
                     { key: 'Friday', value: 'Friday', text: 'Friday' },
                     { key: 'Saturday', value: 'Saturday', text: 'Saturday' },
                     { key: 'Sunday', value: 'Sunday', text: 'Sunday' },
                     { key: 'Other', value: 'Other', text: 'Other' },
                     { key: '1', value: '1', text: '1' },
                     { key: '2', value: '2', text: '2' },
                     { key: '3', value: '3', text: '3' },
                     { key: '4', value: '4', text: '4' },
                     { key: '5', value: '5', text: '5' },
                     { key: '6', value: '6', text: '6' },
                     { key: '7', value: '7', text: '7' },
                     { key: '8', value: '8', text: '8' },
                     { key: '9', value: '9', text: '9' },
                     { key: '10', value: '10', text: '10' },
                     { key: '11', value: '11', text: '11' },
                     { key: '12', value: '12', text: '12' },
                     { key: '13', value: '13', text: '13' },
                     { key: '14', value: '14', text: '14' },
                     { key: '15', value: '15', text: '15' },
                     { key: '16', value: '16', text: '16' },
                     { key: '17', value: '17', text: '17' },
                     { key: '18', value: '18', text: '18' },
                     { key: '19', value: '19', text: '19' },
                     { key: '20', value: '20', text: '20' },
                     { key: '21', value: '21', text: '21' },
                     { key: '22', value: '22', text: '22' },
                     { key: '23', value: '23', text: '23' },
                     { key: '24', value: '24', text: '24' },
                     { key: '25', value: '25', text: '25' },
                     { key: '26', value: '26', text: '26' },
                     { key: '27', value: '27', text: '27' },
                     { key: '28', value: '28', text: '28' },
                     { key: '29', value: '29', text: '29' },
                     { key: '30', value: '30', text: '30' },
                     { key: '31', value: '31', text: '31' },
                  ]
                  
                  this.setState({
                     sourceLinkOptions: optionsData,
                     frequencyOptions
                  })
               })    
         })
      })
   }

   handleKeywordsAddition = (e, { value }) => {
      this.setState((prevState) => ({
        keywordOptions: [{ text: value, value }, ...prevState.keywordOptions],
      }))
   }

   handleKeywordsFile = (e) => {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = (e) => {
         const text = e.target.result;
         console.log(text);
         let keywordsArray = text.split(';');
         if(keywordsArray.length > 5) {
            this.setState({
            error: true,
            createClicked: true
            }, () => {
            toast.error("Keywords count cannot exceed 50 words", {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined
            });
            })
            
         } else {
            let currentKeywordOptions = this.state.keywordOptions;
            for(let key of keywordsArray) {
               let obj = {};
               obj.key = key;
               obj.text = key;
               obj.value = key
               currentKeywordOptions.push(obj)
            }
            this.setState({
               keywords: keywordsArray,
               keywordOptions: currentKeywordOptions,
               error: false,
               createClicked: false
            })
         }
      };
      reader.readAsText(e.target.files[0]);
   };

   handleAliasAddition = (e, { value }) => {
      this.setState((prevState) => ({
         aliasesOptions: [{ text: value, value }, ...prevState.aliasesOptions],
      }))
   }

   handleAliasesFile = (e) => {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        console.log(text);
        let aliasesArray = text.split(';');
        if(aliasesArray.length > 5) {
          this.setState({
            error: true,
            createClicked: true
          }, () => {
            toast.error("Aliases count cannot exceed 50 words", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            });
          })
        } else {
          let currentAliasesOptions = this.state.aliasesOptions;
          for(let alias of aliasesArray) {
            let obj = {};
            obj.key = alias;
            obj.text = alias;
            obj.value = alias
            currentAliasesOptions.push(obj)
          }
          this.setState({
            aliases: aliasesArray,
            aliasesOptions: currentAliasesOptions,
            error: false,
            createClicked: false
          })
        }
      };
      reader.readAsText(e.target.files[0]);
   };

   handleSourceClassAddition = (e, { value }) => {
      this.setState((prevState) => ({
         sourceClassOptions: [{ text: value, value }, ...prevState.sourceClassOptions],
         sourceClass: value
      }))
   }

   handleAutomationModalClose = () => { this.setState({ AutomationModalOpen: false })}

   prepareSourceLink(csv) {
      console.log("Inside prepareSourceLink");
      var lines = csv.split("\n");
      var sourceClassOptions = [];

      var headers=lines[0].split(",");

      for(var i=1; i<lines.length; i++) {
        var sourceLinkObject = {};
        var splitArray = lines[i].split(",");
        
        let text = splitArray[0];
        let value = splitArray[1];

        sourceLinkObject.key = i;
        sourceLinkObject.value = value;
        sourceLinkObject.text = value;
        
        sourceClassOptions.push(sourceLinkObject);
      }
      return sourceClassOptions;
   }

   async fetchCsv() {
      console.log("inside fetchCSV")
      const response = await fetch('http://localhost:3000/data/link.csv');
      console.log("response", response)
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      console.log('csv', csv);
      return this.prepareSourceLink(csv);
   }

   handleChange = (e, data) => {
      this.setState({
         ...this.state,
         [data.name]: data.value
      });
   };

   addSelectedSourceLinkToState = (includeLinks, excludeLinks) => {
      console.log("inside addSelectedSourceLinkToState")
      this.setState({
        includeLinks,
        excludeLinks
      })
   }

   handleAutomationModalOpen = () => { this.setState({ AutomationModalOpen: true })}
   handleSectionModalClose = () => { this.setState({ sectionModalOpen: false })}
   handleSectionModalOpen = () => { this.setState({ sectionModalOpen: true })}

   handleInputChange = (e) => {
      this.setState({
        ...this.state,
        error: false,
        [e.target.name]: e.target.value,
        //createClicked: false
      })
      if(e.target.name==="keywords" || e.target.name==="aliases") {
        let keywordsArray = this.state.keywords;
        let aliasesArray= this.state.aliases;
        if(keywordsArray.length > 5 || aliasesArray.length > 5) {
          this.setState({
            error: true,
            createClicked: true
          }, () => {
            toast.error("Keywords/Aliases count cannot exceed 50 words", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined
            });
          })
        }
      }
   }

   handleClose = () => {this.setState({ modalOpen: false })}
   handleModalOpen = () => this.setState({ modalOpen: true });

   downloadKeywordsTextFile = (textContents) => {
      const element = document.createElement("a");
      const file = new Blob([textContents], {
         type: "text/plain"
      })
      element.href = URL.createObjectURL(file);
      element.download = "keywords.txt";
      document.body.appendChild(element);
      element.click();
   };

   downloadAliasesTextFile = (textContents) => {
      const element = document.createElement("a");
      const file = new Blob([textContents], {
         type: "text/plain"
      })
      element.href = URL.createObjectURL(file);
      element.download = "aliases.txt";
      document.body.appendChild(element);
      element.click();
   };

   render() {
      console.log("state in edit alert", this.state);
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('HH:mm')
      let currentDateTime = `${currentDate}T${currentTime}`
      currentDateTime = currentDateTime.split(' ')[0];

      const lemmAppOptions = [
         { key: 'null', value: 'NULL', text: 'NULL' },
         { key: 'al', value: 'all_lem', text: 'all_lem' },
         { key: 'as', value: 'all_stem', text: 'all_stem' }
      ]

      const searchTypeOptions = [
         { key: 'cooc', value: 'cooccurence', text: 'cooccurence' },
         { key: 'coocdist', value: 'cooccurence_[KW_distance]', text: 'cooccurence_[KW_distance]' },
         { key: 'std', value: 'standard', text: 'standard' },
         { key: 'stdtitle', value: 'standard title', text: 'standard title' },
         { key: 'coocmulali', value: 'cooccurrence_mult_alias', text: 'cooccurrence_mult_alias' },
         { key: 'coocmulalidist', value: 'cooccurrence_mult_alias_[KW_DISTANCE]', text: 'cooccurrence_mult_alias_[KW_DISTANCE]' }
      ]

      const negSearchBoolOptions = [
         { key: 'null', value: 'NULL', text: 'NULL' },
         { key: 'and', value: 'AND', text: 'AND' },
         { key: 'or', value: 'OR', text: 'OR' },
         { key: 'notURL', value: 'NOT_URL', text: 'NOT_URL' }
      ]

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
                     Edit Alert
                  </Header>
                  <Button 
                     primary 
                     style={{ marginLeft: "75%", marginTop: "20px" }}
                     onClick={() => {window.location.href="/"}}
                  >
                     Home
                  </Button>

                  <Grid columns={3} style={{ marginTop: "20px"}}>
                     <Grid.Row>
                        <Grid.Column>
                           <Form style={{ marginRight: "40px"}}>
                              <Form.Field inline error={this.state.error}>
                                 <label style={{ marginRight: "15px"}}>Keywords</label>
                                 (<a style={{ cursor: "pointer"}} onClick={() => this.downloadKeywordsTextFile(this.state.keywords)}>
                                    keywords.txt
                                 </a>)
                                 <Dropdown
                                    name = 'keywords'
                                    placeholder='Enter keywords' 
                                    fluid 
                                    multiple 
                                    selection
                                    search
                                    options={this.state.keywordOptions} 
                                    onChange={this.handleChange}
                                    value={this.state.keywords}
                                    allowAdditions
                                    onAddItem={this.handleKeywordsAddition}
                                 />

                                 <div style={{ marginTop: "10px"}}>
                                    <Popup content='Keywords must be delimited by a semicolon (;)' trigger={
                                       <input style={{border: "none", backgroundColor: "transparent", resize: "none", outline: "none"}} type="file" 
                                          onChange={this.handleKeywordsFile} />
                                    } />
                                 </div>
                                 </Form.Field>
                
                              </Form>
                              <Form style={{ marginTop: "40px"}}>
                                 <Form.Field inline style={{ marginRight: "40px"}} error={this.state.error}>
                                    <label style={{ marginRight: "15px"}}>Aliases</label>
                                    (<a style={{ cursor: "pointer"}} onClick={() => this.downloadAliasesTextFile(this.state.aliases)}>
                                       aliases.txt
                                    </a>)
                                    <Dropdown
                                       name = 'aliases'
                                       placeholder='Enter aliases' 
                                       fluid 
                                       multiple 
                                       selection
                                       search 
                                       options={this.state.aliasesOptions} 
                                       onChange={this.handleChange}
                                       allowAdditions
                                       onAddItem={this.handleAliasAddition}
                                       value={this.state.aliases}
                                    />
                                    <Popup content='Aliases must be delimited by a semicolon (;)' trigger={
                                       <div style={{ marginTop: "10px"}}>
                                          <input style={{border: "none", backgroundColor: "transparent", resize: "none", outline: "none"}} type="file" onChange={this.handleAliasesFile} />
                                       </div>
                                    } />
                                 </Form.Field>
                              </Form>
                           </Grid.Column>
                              <Form>
                                 <Form.Field inline>
                                    <label style={{ marginRight: "20px"}}>Search type</label>
                                    <Select
                                       style={{ marginLeft: "18px", minWidth:"230px"}} 
                                       placeholder='Select type'
                                       name = 'searchtype'
                                       value={this.state.searchtype}
                                       options={searchTypeOptions} 
                                       onChange={this.handleChange}
                                       search
                                    />
                                 </Form.Field>
                                 <Segment>
                                 <Grid columns={2} relaxed='very'>
                                    <Grid.Column>
                                       <Form.Field>
                                       <label>Source class</label>
                                       <Select 
                                          style={{ minWidth:"100px"}} 
                                          placeholder='Select source'
                                          name = 'sourceClass'
                                          search
                                          value={this.state.sourceClass}
                                          options={this.state.sourceClassOptions} 
                                          onChange={this.handleChange}
                                          allowAdditions
                                          onAddItem={this.handleSourceClassAddition}
                                       />
                                       </Form.Field>
                                    </Grid.Column>
                                    <Grid.Column>
                                       <SourceLinkModal 
                                          options={this.state.sourceLinkOptions}
                                          parentCallback={this.addSelectedSourceLinkToState}
                                       />
                                    </Grid.Column>
                                 </Grid>

                                 <Divider vertical>OR</Divider>
                                 </Segment>

                                 <Modal
                                    size='tiny'
                                    closeIcon
                                    trigger={<Button style={{ marginTop: "17px"}}>Automation efforts</Button>}
                                    onOpen={this.handleAutomationModalOpen}
                                    onClose={this.handleAutomationModalClose}
                                    open={this.state.AutomationModalOpen}
                                 >
                                 <Header content='Automation efforts' />
                                    <Modal.Content>
                                       <Form style={{ marginBottom: "20px"}}>
                                          <Form.Field inline >
                                          <label ><b>Syntactical Relevance Model</b></label>
                                          <Radio
                                             toggle
                                             name="synrel"
                                             style={{ marginLeft: "250px"}}
                                             onChange={(e, data) => {
                                                this.state.synrel = data.checked
                                             }}
                                             value={this.state.synrel}
                                             defaultChecked={this.state.synrel}
                                          />
                                          </Form.Field>
                                          <Form.Field inline style={{ marginTop: "5px"}}>
                                             <label ><b>Main disease detection and Adjacency ranking</b></label>
                                             <Radio
                                                toggle
                                                style={{ marginLeft: "150px"}}
                                                name="mddar"
                                                onChange={(e, data) => {
                                                this.state.mddar = data.checked
                                                }}
                                                value={this.state.mddar}
                                                defaultChecked={this.state.mddar}
                                             />
                                          </Form.Field>
                                          <Form.Field inline style={{ marginTop: "5px"}}>
                                             <label ><b>Irrelevant text removal</b></label>
                                             <Radio
                                                toggle
                                                name="irrtextrem"
                                                style={{ marginLeft: "282px"}}
                                                onChange={(e, data) => {
                                                this.state.irrtextrem = data.checked
                                                }}
                                                value={this.state.irrtextrem}
                                                defaultChecked={this.state.irrtextrem}
                                             />
                                          </Form.Field>
                                          <Form.Field inline style={{ marginTop: "5px"}}>
                                             <label ><b>M&A relevancy matrix</b></label>
                                             <Radio
                                                toggle
                                                style={{ marginLeft: "285px"}}
                                                name="marelmat"
                                                onChange={(e, data) => {
                                                this.state.marelmat = data.checked
                                                }}
                                                value={this.state.marelmat}
                                                defaultChecked={this.state.marelmat}
                                             />
                                          </Form.Field>
                                       </Form>
                                       
                                    </Modal.Content>
                                    <Modal.Actions>
                                       <Button color='green' onClick={this.handleAutomationModalClose}>
                                          <Icon name='checkmark' /> OK
                                       </Button>
                                    </Modal.Actions>
                                 </Modal>

                                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                 <Modal
                                    size='tiny'
                                    closeIcon
                                    trigger={<Button style={{ marginTop: "17px"}}>Section Add-on</Button>}
                                    onOpen={this.handleSectionModalOpen}
                                    onClose={this.handleSectionModalClose}
                                    open={this.state.sectionModalOpen}
                                 >
                                 <Header content='Section Add-ons' />
                                    <Modal.Content>
                                       <Form style={{ marginBottom: "20px"}}>
                                       <Form.Field inline >
                                       <label ><b>Summary</b></label>
                                       <Radio
                                          toggle
                                          name="summary"
                                          style={{ marginLeft: "353px"}}
                                          onChange={(e, data) => {
                                             this.state.summary = data.checked
                                          }}
                                          value={this.state.summary}
                                          defaultChecked={this.state.summary}
                                       />
                                       </Form.Field>
                                       <Form.Field inline style={{ marginTop: "5px"}}>
                                          <label ><b>Related stories</b></label>
                                          <Radio
                                             toggle
                                             style={{ marginLeft: "322px"}}
                                             name="relstories"
                                             onChange={(e, data) => {
                                             this.state.relstories = data.checked
                                             }}
                                             value={this.state.relstories}
                                             defaultChecked={this.state.relstories}
                                          />
                                       </Form.Field>
                                       <Form.Field inline style={{ marginTop: "5px"}}>
                                          <label ><b>Historical related stories</b></label>
                                          <Radio
                                             toggle
                                             name="hisrelstories"
                                             style={{ marginLeft: "266px"}}
                                             onChange={(e, data) => {
                                             this.state.hisrelstories = data.checked
                                             }}
                                             value={this.state.hisrelstories}
                                             defaultChecked={this.state.hisrelstories}
                                          />
                                       </Form.Field>
                                       <Form.Field inline style={{ marginTop: "5px"}}>
                                          <label ><b>Trending news</b></label>
                                          <Radio
                                             toggle
                                             style={{ marginLeft: "326px"}}
                                             name="trendnews"
                                             onChange={(e, data) => {
                                             this.state.trendnews = data.checked
                                             }}
                                             value={this.state.trendnews}
                                             defaultChecked={this.state.trendnews}
                                          />
                                       </Form.Field>
                                       </Form>
                                       
                                    </Modal.Content>
                                    <Modal.Actions>
                                       <Button color='green' onClick={this.handleSectionModalClose}>
                                          <Icon name='checkmark' /> OK
                                       </Button>
                                    </Modal.Actions>
                                 </Modal>

                                 <Form.Field inline style={{ marginTop: "50px"}}>
                                    <label>Lemmatizer Application</label>
                                    <Select
                                       style={{ minWidth: "185px"}}
                                       placeholder='Enter type'
                                       name = 'lemmapp'
                                       value={this.state.lemmapp}
                                       options={lemmAppOptions} 
                                       onChange={this.handleChange}
                                       search
                                    />
                                 </Form.Field>
                                 <Modal
                                    size='small'
                                    closeIcon
                                    trigger={<Button style={{ marginTop: "17px"}}>Lemmatizer options</Button>}
                                    onOpen={this.handleModalOpen}
                                    onClose={this.handleClose}
                                    open={this.state.modalOpen}
                                 >
                                 <Header content='Lemmatizer options' />
                                    <Modal.Content>
                                       <Form>
                                             <Form.Field inline>
                                             <label><b>Alias lemmatization</b></label>
                                             <input
                                                name="aliaslem"
                                                style={{ marginLeft: "100px", minWidth: "400px"}} 
                                                placeholder="Enter alias lemmatization"
                                                onChange={this.handleInputChange}
                                                value={this.state.aliaslem}
                                             />
                                             </Form.Field>
                                             <Form.Field inline>
                                             <label ><b>Negative aliases</b></label>
                                             <input 
                                                name="negalias" 
                                                style={{ marginLeft: "122px", minWidth: "400px"}}
                                                placeholder="Enter negative alias"
                                                onChange={this.handleInputChange}
                                                value={this.state.negalias}
                                             />
                                             </Form.Field>
                                             <Form.Field inline>
                                             <label ><b>Negative search boolean</b></label>
                                             <Select 
                                                name="negsearchbool" 
                                                style={{ marginLeft: "73px", minWidth: "400px"}}
                                                value={this.state.negsearchbool}
                                                options={negSearchBoolOptions} 
                                                onChange={this.handleChange}
                                                search
                                                placeholder="Enter negative search boolean"
                                             />
                                             </Form.Field>
                                             <Form.Field inline>
                                             <label><b>Negative alias lemmatization</b></label>
                                             <input 
                                                name="negaliaslemm"
                                                style={{ marginLeft: "48px", minWidth: "400px"}}
                                                placeholder="Enter negative alias lemmatization"
                                                onChange={this.handleInputChange}
                                                value={this.state.negaliaslemm}
                                             />
                                             </Form.Field>
                                             <Form.Field inline>
                                             <label ><b>Sentence without negative boolean</b></label>
                                             <Radio
                                                style={{ marginLeft: "12px"}}
                                                toggle
                                                name="senWoNegBool"
                                                onChange={(e, data) => {
                                                   this.state.senWoNegBool = data.checked
                                                }}
                                                value={this.state.senWoNegBool}
                                                defaultChecked = {this.state.senWoNegBool}
                                             />
                                             </Form.Field>
                                       </Form>
                                    </Modal.Content>
                                    <Modal.Actions>
                                       <Button color='red' onClick={this.handleClose}>
                                          <Icon name='remove' /> Cancel
                                       </Button>
                                       <Button color='green' onClick={this.handleClose}>
                                          <Icon name='checkmark' /> Confirm
                                       </Button>
                                    </Modal.Actions>
                                 </Modal>
                              </Form>

                              <Grid.Column>
                              <Form style={{marginLeft: "58px"}}>
                              <Form.Field inline>
                                 <label style={{ marginRight: "30px"}}>User</label>
                                 <Input
                                    name="user"
                                    style={{ marginLeft: "25px" }} 
                                    placeholder="Enter user"
                                    value={this.state.user}
                                    onChange={this.handleInputChange}
                                 />
                              </Form.Field>
                              <Form.Field inline>
                                 <label >Email alert</label>
                                 <Radio 
                                    toggle
                                    name="emailAlert"
                                    style={{ marginLeft: "15px"}}
                                    onChange={(e, data) => {
                                    this.state.emailAlert = data.checked
                                    }}
                                    value={this.state.emailAlert}
                                    defaultChecked
                                 />
                              </Form.Field>

                              <Form.Field inline>
                                 <label style={{ marginRight: "25px"}}>Alert title</label>
                                 <Input 
                                    placeholder="Enter title"
                                    name="alertTitle" 
                                    value={this.state.alertTitle}
                                    onChange={this.handleInputChange}
                                 />
                              </Form.Field>
                              
                              <Form.Field inline>
                                 <label style={{ marginRight: "15px"}}>Date added</label>
                                 <input 
                                    type="date" 
                                    min={currentDateTime.split(' ')[0]}
                                    value={this.state.alertDate}
                                    name="alertDate"
                                    onChange={this.handleInputChange}
                                    />
                              </Form.Field>

                              <Button 
                                 primary 
                                 style={{ marginTop: "10px"}} 
                                 onClick={this.handleCreateClick}
                                 disabled={this.state.createClicked}
                              >
                                 Save Updates
                              </Button>
                              </Form>
                           </Grid.Column>
                           </Grid.Row>
                        </Grid>
                  {this.state.alertCreationConfirmed && this.renderConfirmationResponseModal()}
               </div>
            )}
            {this.state.createClicked && this.renderConfirmationModal()}
         </div>
      )
   }

   renderConfirmationResponseModal = () => {
      console.log("inside renderConfirmationResponseModal")
      return (
        <Modal
          open={this.state.alertCreationConfirmed}
          onClose={this.handleConfirmationResponseModalClose}
          closeIcon
          size='small'
          >
            <Modal.Content>
              <h2 style={{ textAlign: 'center'}}>
                Alert Updated! <Icon color="green" name="check circle" />
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

   renderConfirmationModal = () => {
      console.log("inside renderConfirmationModal")
      return (
        <Modal
          open={this.state.createClicked}
          onClose={this.handleConfirmationModalClose}
          closeIcon
          size='small'
          >
            <Header>Confirm Alert</Header>
            <Modal.Content>
              <Form>
                <Form.Field inline>
                <label style={{ marginRight: "20px"}}>Email Subject</label>
                <input
                  name="emailSubject"
                  style={{ marginLeft: "25px", minWidth: "400px" }} 
                  placeholder="Enter email subject line"
                  value={this.state.emailSubject}
                  onChange={this.handleInputChange}
                />
                </Form.Field>

                <Form.Field inline>
                <label style={{ marginRight: "77px"}}>Heading</label>
                  <Dropdown
                    name= 'header'
                    placeholder= 'Select header'
                    selection
                    search
                    options={this.state.headingOptions} 
                    onChange={this.handleChange}
                    value={this.state.header}
                    allowAdditions
                    onAddItem={this.handleHeadingAddition}
                  />
                </Form.Field>

                <Form.Field inline>
                <label style={{ marginRight: "55px"}}>Sub heading</label>
                <Dropdown
                  name= 'subheader'
                  placeholder= 'Select subheading'
                  selection
                  search
                  options={this.state.subheadingOptions} 
                  onChange={this.handleChange}
                  value={this.state.subheader}
                  allowAdditions
                  onAddItem={this.handleSubHeadingAddition}
                />
                </Form.Field>

                <Form.Field inline>
                  <label style={{ marginRight: "20px"}}>Sub heading order</label>
                  <input
                    name="subheaderOrder"
                    placeholder="Select subheading order"
                    value={this.state.subheaderOrder}
                    onChange={this.handleInputChange}
                    style={{ width: "195px"}}
                  />
                </Form.Field>

                <Form.Field>
                  <label>Recepient List</label>
                  <TextArea
                    name="recepientList"
                    style={{ minHeight: 50 }} 
                    placeholder="Enter recepient list"
                    onChange={this.handleInputChange}
                    value={this.state.recepientList}
                  />
                </Form.Field>

                <Form.Field inline>
                  <label style={{ marginRight: "55px"}}>Frequency</label>
                  <Dropdown
                    name= 'frequency'
                    placeholder= 'Select frequency'
                    selection
                    search
                    options={this.state.frequencyOptions} 
                    onChange={this.handleChange}
                    value={this.state.frequency}
                    multiple
                  />
                </Form.Field>
              </Form>

              {/* Stuff like ordering sub headings */}
            </Modal.Content>
            <Modal.Actions>
              <Button color='red' onClick={() => this.handleConfirmationModalClose()}>
                <Icon name='remove' /> Cancel
              </Button>
              <Button color='green' onClick={() => this.handleConfirmClick()}>
                <Icon name='checkmark' /> Confirm
              </Button>
          </Modal.Actions>
        </Modal>
      )
   }

   handleCreateClick = async() => {
      console.log("Inside handleCreateClick")
      this.setState({
        createClicked: true
      })
   }

   handleConfirmationResponseModalClose = () => {
      this.setState({ alertCreationConfirmed: false})
   }

   handleConfirmClick = async() => {
      console.log("inside handleConfirmClick")
      //sending request to backend
      const response = await axios
      // .post('https://omealerts.herokuapp.com/', this.state)\
      .post('http://localhost:5000/update', this.state)
      .catch(err => {
        console.log("error in Axios request", err.message);
        toast.error(err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        this.setState({
          createClicked: false
        })
      })
      console.log("response from create alert", response);

      if(response.status === 200) {
        this.setState({
          alertCreationConfirmed: true,
          createClicked: false
        })
      }
   }
}