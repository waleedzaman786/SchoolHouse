import React from 'react';
import { Form, Input, TextArea, Dropdown, Button, Icon } from 'semantic-ui-react';
import Cookies from 'js-cookie';

import {apiBaseUrl} from '../../../../../ApiAction/DbConfig/ApiBaseUrl';

export function AddMedicalInformation(props) {
let token = Cookies.get('loginUserToken');
  let { childForm,
    loginUserInfo,
    gender, childRace,
    medicalInformationFormValidator,
    medicalReports,
    showButtonLoader,
    allMedicalReport
  } = props,
    { medicalInformation } = childForm,
    validator = medicalInformationFormValidator,
    physical_reports=medicalInformation.medical_reports;
  return (
    
    <Form id="medicalInformation" name="medicalInfo" onSubmit={() => props._saveForm(validator,'medicalInformation','devReport','devReport' )}>
      <Form.Group widths="equal">
        <Form.Field  required>
          <label> Doctor Name</label>
          <Input type="text" name='doctor_name' value={medicalInformation.doctor_name} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('doctor_name', medicalInformation.doctor_name, 'required')}

        </Form.Field>
        <Form.Field  required>
          <label> Doctor Phone</label>
          <Input type="text" className="no-arrow" name='doctor_phone' value={medicalInformation.doctor_phone} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('doctor_phone', medicalInformation.doctor_phone, 'required')}

        </Form.Field>
        <Form.Field  >
          <label> Doctor Email</label>
          <Input type="email" name='doctor_email' value={medicalInformation.doctor_email} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {/* {validator.message('doctor_email', medicalInformation.doctor_email, 'required')} */}

        </Form.Field>
      </Form.Group>
      <Form.Group widths="equal"  >
        <Form.Field  required>
          <label>Primary Language</label>
          <Input type="text" name='doctor_primary_language' value={medicalInformation.doctor_primary_language} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('doctor_primary_language', medicalInformation.doctor_primary_language, 'required')}

        </Form.Field>
        <Form.Field  required>
          <label>Insurance Carrier</label>
          <Input type="text" name='doctor_insurance_carrier' value={medicalInformation.doctor_insurance_carrier} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('doctor_insurance_carrier', medicalInformation.doctor_insurance_carrier, 'required')}

        </Form.Field>
        <Form.Field  required>
          <label>Insurance Number</label>
          <Input type="text" name='doctor_insurance_number' value={medicalInformation.doctor_insurance_number} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('doctor_insurance_number', medicalInformation.doctor_insurance_number, 'required')}

        </Form.Field>
      </Form.Group>
      <Form.Group widths="equal"  >
        <Form.Field  required>
          <label>Last Physical Date</label>
          <Input type="date" name='last_physical_date' value={medicalInformation.last_physical_date} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('last_physical_date', medicalInformation.last_physical_date, 'required')}
        </Form.Field>
        <Form.Field  >
          <label>Immunizations</label>
          <Input type="date" name='immunizations' value={medicalInformation.immunizations} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {/* {validator.message('immunizations', medicalInformation.immunizations, 'required')} */}
        </Form.Field>
        <Form.Field  >
          <label>Lead Screen Date</label>
          <Input type="date" name='lead_screen_date' value={medicalInformation.lead_screen_date} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {/* {validator.message('lead_screen_date', medicalInformation.lead_screen_date, 'required')} */}
        </Form.Field>
      </Form.Group>
      <Form.Group widths='equal'>
        {
          physical_reports.length<=5 ?<Form.Field width={3} >
          <label className="file">Upload medical report:
        <input type="file" aria-label="File browser example" style={{ display: "none" }}
              name="myFile" id="myFile"
              accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => props._handleFileUpload('medicalInformation', event)}
              multiple
              className="custom-file-input"
            />
            <div className="custom-file-btn">Choose File</div>
          </label>
        </Form.Field> :<Form.Field width={3} >
              <label className="file">Upload medical report:
            <input type="file" aria-label="File browser example" style={{ display: "none" }}
                  name="myFile" id="myFile"
                  accept="image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => props._handleFileUpload('medicalInformation', event)}
                  multiple
                  className="custom-file-input"
                />
                <div className="custom-file-btn">Choose File</div>
              </label>
            </Form.Field> 
        }
      
        {
          medicalReports === "" ? <Form.Field width={13}/> :
            <Form.Field width={13} className="view-uploaded-files" >
              <div className="file-upload">
              {
                  physical_reports.length ? physical_reports.map((value, index) => {
                  return (
                    <div className="file-box" key={value.id}>
                      <div className="medical-reports" title={value.physical_report}>
                        <span onClick={()=>props._viewReport(apiBaseUrl+'/file/report/'+medicalInformation.child_id+'/'+value.physical_report+'/'+token)} >{value.physical_report}</span>
                        {/* <span  rel="noopener noreferrer">{value}</span> */}
                        {/*  */}
                      </div>
                      <div className="close-icon" onClick={(e) => props._removeMedicalFileInEditChild('medicalInformation', 'medical_reports', index, e)}>
                        <i aria-hidden="true" className="close red icon" ></i>
                      </div>
                    </div>
                  )
                }) :''
              }
                {
                  allMedicalReport.length ? allMedicalReport.map((value, index) => {
                    return (
                      <div className="file-box">
                        <div className="medical-reports" title={value}>
                          {value}
                        </div>
                        <div className="close-icon" onClick={(e) => props._removeMedicalReport(index, e)}><i aria-hidden="true" className="close red icon"></i></div>
                      </div>
                    )
                  }) : ''
                }
              </div>
            </Form.Field>
        }
      </Form.Group>
      <Form.Group widths="equal"  >
        <Form.Field  required>
          <label>Allergies</label>
          <TextArea rows={2} name='allergies' value={medicalInformation.allergies} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('allergies', medicalInformation.allergies, 'required')}

        </Form.Field>
      </Form.Group>

      <Form.Group widths="equal"  >
        <Form.Field  required>
          <label>Hair Color</label>
          <Input type="text" name='hair_color' value={medicalInformation.hair_color} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('hair_color', medicalInformation.hair_color, 'required')}

        </Form.Field>
        <Form.Field  required>
          <label>Eye Color</label>
          <Input type="text" name='eye_color' value={medicalInformation.eye_color} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('eye_color', medicalInformation.eye_color, 'required')}

        </Form.Field>
        <Form.Field  required>
          <label>Gender</label>
          <Dropdown
            placeholder='Select Gender'
            fluid
            search
            selection
            options={gender}
            value={medicalInformation.gender}
            name="gender"
            onChange={(event, { value, name }) => props._handleFormDropDown('medicalInformation', event, value, name)}
          />
          {validator.message('gender', medicalInformation.gender, 'required')}

        </Form.Field>

      </Form.Group>


      <Form.Group widths="equal"  >
        <Form.Field  required>
          <label>Height (inches)</label>
          <Input type="number" name='height' value={medicalInformation.height} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('height', medicalInformation.height, 'required')}

        </Form.Field>
        <Form.Field  required>
          <label>Weight (pounds)</label>
          <Input type="number" name='weight' value={medicalInformation.weight} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('weight', medicalInformation.weight, 'required')}

        </Form.Field>
        <Form.Field  required>
          <label>Race</label>
          <Dropdown
            placeholder='Select Race'
            fluid
            selection
            search
            options={childRace}
            value={medicalInformation.race}
            name='race'
            onChange={(event, { value, name }) => props._handleFormDropDown('medicalInformation', event, value, name)}
          />
          {validator.message('race', medicalInformation.race, 'required')}

        </Form.Field>


      </Form.Group>

      <Form.Group widths="equal"  >
        <Form.Field  required>
          <label>Identity Marks</label>
          <TextArea rows={2} name='identity_marks' value={medicalInformation.identity_marks} onChange={(event) => props._handleFormInput('medicalInformation', event)} fluid />
          {validator.message('identity_marks', medicalInformation.identity_marks, 'required')}

        </Form.Field>
      </Form.Group>

      <Form.Group>
        <h4>SCHOOL DIRECTORY<br />
          <i>The school directory will be distributed only to the participants.
  <br />The school directory must not be used to solicit business but rather for the purpose it was intended, planning play dates, birthday invites and other celebration, or contacting a class parent.</i>
        </h4>
      </Form.Group>
      <Form.Group widths="equal">
        <div className="field">
          <div className="ui checkbox">
            <input type="checkbox" name="add_child_to_directory" checked={medicalInformation.add_child_to_directory} value={medicalInformation.add_child_to_directory} onChange={(event) => props._handleCheckBox('medicalInformation', event)} />
            <label>Add Child To Directory</label>
          </div>
          {validator.message('add_child_to_directory', medicalInformation.add_child_to_directory, 'required')}

        </div>
        <div className="field">
          <div className="ui checkbox">
            <input type="checkbox" name="add_parent_to_directory" checked={medicalInformation.add_parent_to_directory} value={medicalInformation.add_parent_to_directory} onChange={(event) => props._handleCheckBox('medicalInformation', event)} />
            <label>Add Parent 1 To Directory</label>
          </div>
          {validator.message('add_parent_to_directory', medicalInformation.add_parent_to_directory, 'required')}

        </div>
        <div className="field">
          <div className="ui checkbox">
            <input type="checkbox" name="add_parent2_to_directory" checked={medicalInformation.add_parent2_to_directory} value={medicalInformation.add_parent2_to_directory} onChange={(event) => props._handleCheckBox('medicalInformation', event)} />
            <label>Add Parent 2 To Directory</label>
          </div>
          {validator.message('add_parent2_to_directory', medicalInformation.add_parent2_to_directory, 'required')}

        </div>
      </Form.Group>

      <Form.Group widths="equal">
        <div className="field">
          <div className="ui checkbox">
            <input type="checkbox" name="has_signature_checked" checked={medicalInformation.has_signature_checked} value={medicalInformation.has_signature_checked} onChange={(event) => props._handleCheckBox('medicalInformation', event)} />
            <label>This is a signature checkbox verifying the information entered above is correct and complete. On the printed forms your signature will be included</label>
          </div>
          {validator.message('has_signature_checked', medicalInformation.has_signature_checked, 'required')}
        </div>
      </Form.Group>

      <Form.Group>
        <Form.Field>
          <Button positive type="submit" disabled={showButtonLoader}>
            {loginUserInfo.role_id === 2 ? showButtonLoader ? <Icon loading name='spinner' /> : 'Update' : showButtonLoader ? <Icon loading name='spinner' /> : 'Submit'}
          </Button>
        </Form.Field>
      </Form.Group>
    </Form>
  )
}