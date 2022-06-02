const util = require("util");
let connection = require("../../config/database");
let ConnectionUtil = util.promisify(connection.query).bind(connection);
let message = require("../../lib/helpers/message");
let calcBmi = require("bmi-calc");

// -------------------------------- Add_Health_Risk_Questions -------------------------------------
module.exports.add_HealthRiskQuestions = async (req, res) => {
  try {
    let {
      data,
      // type,title,category,description,option,subQuestion,sliderOption,answer,column,rows,score,isRequired,
    } = req.body;
    let { id, company_id } = req.user;
    let msg = "";
    for (let hraQues of data) {
      let post = {
        type: hraQues.type,
        title: hraQues.title,
        category: hraQues.category,
        segments:hraQues.segments!=''?hraQues.segments:'',
        description: hraQues.description,
        optionArray: JSON.stringify(hraQues.optionArray),
        subQuestion: JSON.stringify(hraQues.subQuestion),
        sliderOption: JSON.stringify(hraQues.sliderOption),
        answer: hraQues.answer,
        columnArray: JSON.stringify(hraQues.columnArray),
        rowArray: JSON.stringify(hraQues.rowArray),
        score: hraQues.score,
        isRequired: hraQues.isRequired,
        created_By: id,
        updated_By: id,
        ip_Address: hraQues.ip_Address,
        special:JSON.stringify(hraQues.special),
        dependentQuestionId:hraQues.dependentQuestionId,   //prent ID
        questionId:hraQues.questionId,    //question
        dependentOption:JSON.stringify(hraQues.dependentOption) //optionNumber
      }; 
      let hraDetail = await ConnectionUtil(
        `INSERT INTO  health_Risk_Questions_Details SET?`,
        post
      );
    }
    res.status(200).json({
      success: true,
      message: "hra risk Questions Added",
    });
  } catch (err) {
    console.log(err)
    res.status(400).json(message.err);
  }
};
// -------------------------------- Show_Health_Risk_Questions -------------------------------------
module.exports.show_HealthRiskQuestions = async (req, res) => {
  try { 
    let hraDetail = await ConnectionUtil(`select * from health_Risk_Questions_Details `);  //ORDER BY healthQuestions_id DESC
    let newArr=[];
      for(let hradata of hraDetail){
        hradata.attempted =2;
        hradata.assigned=10;
        hradata.userDetail = [{profile_picture:"download.png",userId:"1"},{profile_picture:"download.png",userId:"1"},{profile_picture:"download.png",userId:"1"}];
        newArr.push(hradata)
      }
    res.status(200).json({
      success: true,
      message: "show hra risk Questions",
      data: newArr,
    });
  } catch (err) {
    res.status(400).json(message.err);
  }
};

// -------------------------------- Edit_Health_Risk_Questions -------------------------------------
module.exports.edit_HealthRiskQuestions = async (req, res) => {
  try {
    let {
      healthQuestions_id,
      type,
      title,
      category,
      description,
      optionArray,
      subQuestion	,
      sliderOption,
      answer,
      columnArray,
      ip_Address,
      rowArray,
      score,
      isRequired,
      segments	,
      // dependentQuestionId,  //prent ID
      // questionId,    //question
      // dependentOption
      // ----
      // healthQuestionsId,
      // type,
      // title,
      // category,
      // description,
      // optionArray,
      // subQuestion,
      // sliderOption,
      // answer,
      // columnArray,
      // rowArray,
      // score,
      // isRequired,
      // ip_Address,
      // segments
    } = req.body;
    let { id } = req.user;
    let hraDetail = await ConnectionUtil(
      `select * from health_Risk_Questions_Details  where isActive='1' AND healthQuestions_id ='${healthQuestions_id}' `
    );
    if (hraDetail != "") {
      let optionArrays = JSON.stringify(optionArray);
      let subQuestions = JSON.stringify(subQuestion);
      let columnArrays = JSON.stringify(columnArray);
      let rowArrayS         = JSON.stringify(rowArray);
      let sliderOptions = JSON.stringify(sliderOption);
      var hraUpdateQueryFind = await ConnectionUtil(`update health_Risk_Questions_Details set     
        type               = '${type}'        ,
        title              = '${title}'       ,
        category           = '${category}'    ,
        description        = '${description}' ,
        optionArray        = '${optionArrays}' ,
        subQuestion        = '${subQuestions}',
        sliderOption       = '${sliderOptions}',
        answer             = '${answer}',
        columnArray        = '${columnArrays}',
        rowArray           = '${rowArrayS}',
        score              = '${score}',
        isRequired         = '${isRequired}', 
        ip_Address         = '${ip_Address}',
        updated_By         = '${id}',
        segments           = '${segments}'
        where healthQuestions_id ='${healthQuestions_id}'`);

        // ,
        // dependentQuestionId= '${dependentQuestionId}',
        // questionId         = '${questionId}',
        // dependentOption    = '${dependentOption}'

        res.status(200).json({
        success: true,
        message: "show hra risk Questions",
        data: hraUpdateQueryFind,
      });
    }else{
      res.status(404).json({
        success: false,
        message: "hra question id not found"
      });
    }
  } catch (err) {
    console.log(err)
    res.status(400).json(message.err);
  }
};

// -------------------------------- Edit_Health_Risk_QuestionsById -------------------------------------
module.exports.show_HealthRiskQuestionsById = async (req, res) => {
  try {
    let{healthQuestionsId}=req.body;
    let hraDetail = await ConnectionUtil(`select * from health_Risk_Questions_Details where healthQuestions_id='${healthQuestionsId}' ORDER BY healthQuestions_id DESC`);
    res.status(200).json({
      success: true,
      message: "show hra risk Questions by Id",
      data: hraDetail,
    });
  } catch (err) {
    res.status(400).json(message.err);
  }
};


// -------------------------------- Edit_Health_Risk_Questions -------------------------------------
module.exports.questionDelete = async (req, res) => {
  try {
    let {questionId} = req.body;
    let hraDetail = await ConnectionUtil(
      `DELETE FROM health_Risk_Questions_Details where healthQuestions_id= '${questionId}'`);
      res.status(200).json({
        success: true,
        message: "question deleted successfully",
        data: hraDetail
      });
  } catch (err) {
    console.log(err)
    res.status(400).json(message.err);
  }
};


// ------------------------- hra_report -----------------------------------
module.exports.hra_report = async (req, res) => {
  try {  
    let hraRecode_pointAverage = await ConnectionUtil(`select (HRQD.category) as category , SUM(UHSUBMISSION.question_Point) as avg ,UHSUBMISSION.user_Id from 
    user_hrasubmit as UHSUBMIT JOIN user_hrasubmission as UHSUBMISSION ON 
    UHSUBMIT.user_Id =UHSUBMISSION.user_Id JOIN health_Risk_Questions_Details as HRQD ON  HRQD.healthQuestions_id=UHSUBMISSION.healthQuestions_Id
    where UHSUBMIT.company_Id group by HRQD.category ,UHSUBMISSION.user_Id`);

    let total_userWellness = await ConnectionUtil(`select * from  user_hrasubmit`);
    
    let employeeReadiness_Count = await ConnectionUtil(`select count(*),options from user_hrasubmission  where  healthQuestions_Id=60  group by options`); 
    
    let tot_gender = await ConnectionUtil (`select gender, COUNT(UH.user_id) as count from user_hrasubmit as UH JOIN user as U ON  U.user_id = UH.user_Id where
    U.isActive=1 AND gender!='' AND gender IS NOT NULL  group by gender`);
    
    let tot_employeesParticipating  = await ConnectionUtil (`select COUNT(*) as count from userassign_programgoals group by user_Id`);
    
    let total_Score = await ConnectionUtil (`select * from user_hrasubmit`);
    
    let score_companies = await ConnectionUtil (`select  C.company_Name,SUM(total_Score) as count  from user_hrasubmit as UH  JOIN company as C ON UH.company_Id = C.company_id group by UH.company_Id ORDER BY total_Score DESC`);
   
    let score_segment = await ConnectionUtil(`select segments ,COUNT(*) as count from user_hrasubmission as UH JOIN 
    health_Risk_Questions_Details as HRD ON  HRD.healthQuestions_id =UH.healthQuestions_Id group by segments`);

    let tot_low=0;
    let tot_medium=0; 
    let tot_high=0;
    let val = await hraRecode(hraRecode_pointAverage);
    for(let userPoint of  total_userWellness){
      
      if(userPoint.total_Score>=18 && userPoint.total_Score<=35){
        tot_low = tot_low + 1 ;
      }
      if(userPoint.total_Score >=36 &&userPoint.total_Score <=50){
        tot_medium = tot_medium + 1;
      }
      if(userPoint.total_Score>=50){
        tot_high = tot_high + 1;
      }
    }
    let willness_point = {
      medium : tot_medium,
      low    : tot_low,
      high   : tot_high 
    } 
    //----- BMI
    let ratioPoint = 0;
    let bmiPoint = 0;
    let bmiAge0 = 0;
    let bmiAge1 = 0;
    let bmiAge2 = 0;
    let bmiAge3 = 0;
    let bmiAge4 = 0;
    let bmiGenderM = 0;
    let bmiGenderF = 0;
    let userGender = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options , va.age , u.gender FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON (sn.user_Id = st.user_Id) JOIN view_userage va   
      ON (st.user_Id = va.user_id) JOIN user u 
      ON (st.user_Id = u.user_id)
      where healthQuestions_Id='1' AND st.status = '1' AND sn.status='1'`
    );
    let waistRatioSore = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options , va.age , u.gender FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON (sn.user_Id = st.user_Id) JOIN view_userage va   
      ON (st.user_Id = va.user_id) JOIN user u 
      ON (st.user_Id = u.user_id)
      where healthQuestions_Id='10' AND st.status = '1' AND sn.status='1'`
    );
    let hipRatioSore = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options , va.age , u.gender FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON (sn.user_Id = st.user_Id) JOIN view_userage va   
      ON (st.user_Id = va.user_id) JOIN user u 
      ON (st.user_Id = u.user_id)
      where healthQuestions_Id='11' AND st.status = '1' AND sn.status='1'`
    );
    let heightSore = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options , va.age , u.gender FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON (sn.user_Id = st.user_Id) JOIN view_userage va   
      ON (st.user_Id = va.user_id) JOIN user u 
      ON (st.user_Id = u.user_id)
      where healthQuestions_Id='8' AND st.status = '1' AND sn.status='1'`
    );
    let weightSore = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options , va.age , u.gender FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON (sn.user_Id = st.user_Id) JOIN view_userage va   
      ON (st.user_Id = va.user_id) JOIN user u 
      ON (st.user_Id = u.user_id)
      where healthQuestions_Id='9' AND st.status = '1' AND sn.status='1'`
    );

    for (let i = 0; i <= weightSore.length - 1; i++) {
      if (
        waistRatioSore.length > 0 &&
        hipRatioSore.length > 0 &&
        userGender.length > 0
      ) {
        let w = waistRatioSore[i].options;
        let h = hipRatioSore[i].options;
        let Ratio = w / h;
        let fixedNum = Ratio.toFixed(2);
        // male
        if (userGender[i].options == "Male") {
          if (fixedNum <= "0.95") {
            ratioPoint += 0;
          }
          if (fixedNum >= "0.96" && fixedNum <= "1.0") {
            ratioPoint += 3;
          }
          if (fixedNum >= "1.0") {
            ratioPoint += 4;
          }
        }
        // female
        if (userGender[i].options == "Female") {
          if (fixedNum <= "0.80") {
            ratioPoint += 0;
      }
          if (fixedNum >= "0.81" && fixedNum <= "0.85") {
            ratioPoint += 3;
          }
          if (fixedNum >= "0.86") {
            ratioPoint += 4;
          }
        }
      }
      if (heightSore.length > 0 && weightSore.length > 0) {
        let height = heightSore[i].options / 100;
        let weight = weightSore[i].options;
        let valBMI = calcBmi(weight, height);
        let totBMI = valBMI.value.toFixed(1);
        // Math.fround(totBMI) < Math.fround(18.5)
        // if( Math.fround(totBMI) <= Math.fround(18.5) ){ console.log('One'); bmiPoint=1}
        // if( Math.fround(totBMI) >=  && Math.fround(totBMI) <= ){console.log('Two'); bmiPoint=0}
        // if( Math.fround(totBMI) >=  && Math.fround(totBMI) <= ){console.log('Three'); bmiPoint=1}
        // if( Math.fround(totBMI)>=  &&  Math.fround(totBMI) <= ){console.log('Four'); bmiPoint=3}

        if (weightSore[i].gender == 'Male') {
          if (totBMI <= "18.5") {
            bmiGenderM += 1;
            
          }
          if (totBMI >= "18.5" && totBMI <= "24.9") {
            bmiGenderM += 0;
            
          }
          if (totBMI >= "25" && totBMI <= "29.9") {
            bmiGenderM += 1;
            
          }
          if (totBMI >= "30" && totBMI <= "39.9") {
            bmiGenderM += 3;            
          }
        }


        if (weightSore[i].gender == 'Female') {
          if (totBMI <= "18.5") {
            bmiGenderF += 1;
            
          }
          if (totBMI >= "18.5" && totBMI <= "24.9") {
            bmiGenderF += 0;
            
          }
          if (totBMI >= "25" && totBMI <= "29.9") {
            bmiGenderF += 1;
            
          }
          if (totBMI >= "30" && totBMI <= "39.9") {
            bmiGenderF += 3;            
          }
        }

        if (weightSore[i].age <= 20) {
          if (totBMI <= "18.5") {
            bmiAge0 += 1;
            
          }
          if (totBMI >= "18.5" && totBMI <= "24.9") {
            bmiAge0 += 0;
            
          }
          if (totBMI >= "25" && totBMI <= "29.9") {
            bmiAge0 += 1;
            
          }
          if (totBMI >= "30" && totBMI <= "39.9") {
            bmiAge0 += 3;            
          }
        }

        if (weightSore[i].age > 20 && weightSore[i].age < 35) {
          if (totBMI <= "18.5") {
            bmiAge1 += 1;
          }
          if (totBMI >= "18.5" && totBMI <= "24.9") {
            bmiAge1 += 0;
          }
          if (totBMI >= "25" && totBMI <= "29.9") {
            bmiAge1 += 1;
          }
          if (totBMI >= "30" && totBMI <= "39.9") {
            bmiAge1 += 3;
          }
        }

        if (weightSore[i].age >= 36 && weightSore[i].age < 51) {
          if (totBMI <= "18.5") {
            bmiAge2 += 1;
          }
          if (totBMI >= "18.5" && totBMI <= "24.9") {
            bmiAge2 += 0;
          }
          if (totBMI >= "25" && totBMI <= "29.9") {
            bmiAge2 += 1;
          }
          if (totBMI >= "30" && totBMI <= "39.9") {
            bmiAge2 += 3;
          }
        }

        if (weightSore[i].age >= 51 && weightSore[i].age < 65) {
          if (totBMI <= "18.5") {
            bmiAge3 += 1;
          }
          if (totBMI >= "18.5" && totBMI <= "24.9") {
            bmiAge3 += 0;
          }
          if (totBMI >= "25" && totBMI <= "29.9") {
            bmiAge3 += 1;
          }
          if (totBMI >= "30" && totBMI <= "39.9") {
            bmiAge3 += 3;
          }
        }

        if (weightSore[i].age > 65) {
          if (totBMI <= "18.5") {
            bmiAge4 += 1;
          }
          if (totBMI >= "18.5" && totBMI <= "24.9") {
            bmiAge4 += 0;
          }
          if (totBMI >= "25" && totBMI <= "29.9") {
            bmiAge4 += 1;
          }
          if (totBMI >= "30" && totBMI <= "39.9") {
            bmiAge4 += 3;
          }
        }
      }
      
    }

    bmiPoint = (bmiAge0 + bmiAge1 + bmiAge2 + bmiAge3 + bmiAge4);
      console.log(bmiPoint);
      var sum = 0;
      sum = sum + ratioPoint + bmiPoint;
    //--------------------health risk analysis------------------------------
    let obesityRiskArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON 
      (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (1,2,8,9,10,11,36,29) AND sn.status='1'`
    );

    let diabetesRiskArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON 
      (sn.user_Id = st.user_Id)
       WHERE healthQuestions_Id IN (1,2,8,9,10,11,16,13,22,36,32) AND sn.status='1'`
    );

    let cardiovascularRiskArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON 
      (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (1,2,8,9,13,14,15,16,21,38,36,32,35) AND sn.status='1'`
    );

    let mentalWellbeingOverallRiskArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON 
      (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (47,48,50,54,55,56,57,58) AND sn.status='1'`
    );

    let motivationAndProductivityRiskArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON 
      (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (25,26,28,40,50,51,55) AND sn.status='1'`
    );

    let occupationalHealthRiskArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
      ON 
      (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (25,26,27,28,36) AND sn.status='1'`
    );

    let totalHraArr = await ConnectionUtil(
      `SELECT * FROM user_hrasubmit WHERE status = '1'`
    );

    let obesityRisk = 0;
    let diabetesRisk = 0;
    let cardiovascularRisk = 0;
    let mentalWellbeingOverallRisk = 0;
    let motivarionAndProductivityRisk = 0;
    let occupationalHealthRisk = 0;

    for (let resp of obesityRiskArr) {
      obesityRisk += resp.question_Point;
    }
    for (let resp of diabetesRiskArr) {
      diabetesRisk += resp.question_Point;
    }
    for (let resp of cardiovascularRiskArr) {
      cardiovascularRisk += resp.question_Point;
    }
    for (let resp of mentalWellbeingOverallRiskArr) {
      mentalWellbeingOverallRisk += resp.question_Point;
    }
    for (let resp of motivationAndProductivityRiskArr) {
      motivarionAndProductivityRisk += resp.question_Point;
    }
    for (let resp of occupationalHealthRiskArr) {
      occupationalHealthRisk += resp.question_Point;
    }

    let obesityRiskPercentage = Math.round(
      (obesityRisk / (14 * totalHraArr.length)) * 100
    );
    let diabetesRiskPercentage = Math.round(
      (diabetesRisk / (32 * totalHraArr.length)) * 100
    );
    let cardiovascularRiskPercentage = Math.round(
      (cardiovascularRisk / (44 * totalHraArr.length)) * 100
    );
    let mentalWellbeingOverallRiskPercentage = Math.round(
      (mentalWellbeingOverallRisk / (16.5 * totalHraArr.length)) * 100
    );
    let motivarionAndProductivityRiskPercentage = Math.round(
      (motivarionAndProductivityRisk / (9.5 * totalHraArr.length)) * 100
    );
    let occupationalHealthRiskPercentage = Math.round(
      (occupationalHealthRisk / (12 * totalHraArr.length)) * 100
    );

      //----------------------------------------segmentWise Calculations ---------------------------------------------

      let personalArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (1,2,3,4,5,6,7) AND sn.status='1'`
      );
      let BiometricsArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (8,9,10,11) AND sn.status='1'`
      );
      let clinicalHistoryArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (12,13,14,15,16,17) AND sn.status='1'`
      );
      let screeningArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (18,19) AND sn.status='1'`
      );
      let familyHistoryArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (21,22) AND sn.status='1'`
      );
      let occupationalHistoryArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (23,24,25,26,27,28) AND sn.status='1'`
      );
      let dietArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (29,30,31,32,33,34,35) AND sn.status='1'`
      );
      let physicalActivityArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (36,37) AND sn.status='1'`
      );
      let tobaccoArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (38,39) AND sn.status='1'`
      );
      let sleepArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (40,41,42,43) AND sn.status='1'`
      );
      let bevergesArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (44,45,46) AND sn.status='1'`
      );
      let stressAndMentalWellbeingArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (47,48,49,50,51,52,53,54,55,56,57,58) AND sn.status='1'`
      );
      let readinessAssessmentArr = await ConnectionUtil(
        `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
    ON 
    (sn.user_Id = st.user_Id) WHERE healthQuestions_Id IN (59,60,61) AND sn.status='1'`
      );
  
      let personal = 0;
      let Biometrics = 0;
      let clinicalHistory = 0;
      let screening = 0;
      let familyHistory = 0;
      let occupationalHistory = 0;
      let diet = 0;
      let physicalActivity = 0;
      let sleep = 0;
      let tobacco = 0;
      let beverges = 0;
      let stressAndMentalWellbeing = 0;
      let readinessAssessment = 0;
  
      let personalTotal = 5;
      let BiometricsTotal = 7;
      let clinicalHistoryTotal = 26;
      let screeningTotal = 2;
      let familyHistoryTotal = 5;
      let occupationalHistoryTotal = 12;
      let dietTotal = 12;
      let physicalActivityTotal = 3;
      let tobaccoTotal = 4;
      let sleepTotal = 6;
      let bevergesTotal = 5;
      let stressAndMentalWellbeingTotal = 16.5;
      let readinessAssessmentTotal;
  
      for (let resp of personalArr) {
        personal += resp.question_Point;
      }
      for (let resp of BiometricsArr) {
        Biometrics += resp.question_Point;
      }
      for (let resp of clinicalHistoryArr) {
        clinicalHistory += resp.question_Point;
      }
      for (let resp of screeningArr) {
        screening += resp.question_Point;
      }
      for (let resp of familyHistoryArr) {
        familyHistory += resp.question_Point;
      }
      for (let resp of occupationalHistoryArr) {
        occupationalHistory += resp.question_Point;
      }
      for (let resp of dietArr) {
        diet += resp.question_Point;
      }
      for (let resp of physicalActivityArr) {
        physicalActivity += resp.question_Point;
      }
      for (let resp of tobaccoArr) {
        tobacco += resp.question_Point;
      }
      for (let resp of sleepArr) {
        sleep += resp.question_Point;
      }
      for (let resp of bevergesArr) {
        beverges += resp.question_Point;
      }
      for (let resp of stressAndMentalWellbeingArr) {
        stressAndMentalWellbeing += resp.question_Point;
      }
      for (let resp of readinessAssessmentArr) {
        readinessAssessment += resp.question_Point;
      }
  
      personal += ratioPoint;
      Biometrics += bmiPoint;
  
      let personalPercentage = Math.round(
        (personal / (personalTotal * totalHraArr.length)) * 100
      );
      let BiometricsPercentage = Math.round(
        (Biometrics / (BiometricsTotal * totalHraArr.length)) * 100
      );
      let clinicalHistoryPercentage = Math.round(
        (clinicalHistory / (clinicalHistoryTotal * totalHraArr.length)) * 100
      );
      let screeningPercentage = Math.round(
        (screening / (screeningTotal * totalHraArr.length)) * 100
      );
      let familyHistoryPercentage = Math.round(
        (familyHistory / (familyHistoryTotal * totalHraArr.length)) * 100
      );
      let occupationalHistoryPercentage = Math.round(
        (occupationalHistory / (occupationalHistoryTotal * totalHraArr.length)) *
          100
      );
      let dietPercentage = Math.round(
        (diet / (dietTotal * totalHraArr.length)) * 100
      );
      let physicalActivityPercentage = Math.round(
        (physicalActivity / (physicalActivityTotal * totalHraArr.length)) * 100
      );
      let tobaccoPercentage = Math.round(
        (tobacco / (tobaccoTotal * totalHraArr.length)) * 100
      );
      let sleepPercentage = Math.round(
        (sleep / (sleepTotal * totalHraArr.length)) * 100
      );
      let bevergesPercentage = Math.round(
        (beverges / (bevergesTotal * totalHraArr.length)) * 100
      );
      let stressAndMentalWellbeingPercentage = Math.round(
        (stressAndMentalWellbeing /
          (stressAndMentalWellbeingTotal * totalHraArr.length)) *
          100
      );
    
    
    let size = 5
    let top_companyScore    = score_companies.slice(0, size); 
    let bottom_companyScore = score_companies.reverse();
    bottom_companyScore.slice(0, size);
 
    let top_segmentScore    = score_segment.slice(0, size); 
    let bottom_segmentScore = score_segment.reverse();
    bottom_segmentScore.slice(0, size);

    //-----------------------------hra improvement calculation over -------------------------------------------------
    
    // console.log(totalHraOldArr , "totalHraOldArr")

    let totalHra = 0;
    totalHraArr.map((data) => {
      totalHra += Number(data.total_Score);
    });

    // let totalHraOld = 0;
    // totalHraOldArr.map((data) => {
    //   totalHraOld += Number(data.total_Score);
    // });

    let lifestyleArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
  ON 
  (sn.user_Id = st.user_Id)
  WHERE sn.healthQuestions_Id IN (29,30,31,32,33,34,35,36,37,38,39,40,40,41,42,43,44,45, 46) AND st.status = 1 AND sn.status='1'`
    );

    let lifestyle = 0;
    lifestyleArr.map((data) => {
      lifestyle += Number(data.question_Point);
    });

    let mindArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
  ON 
  (sn.user_Id = st.user_Id)
  WHERE sn.healthQuestions_Id IN (47,48,49,50,51,52,53,54,55,56,57,58,59,60,61) AND st.status = 1 AND sn.status='1'`
    );

    let mind = 0;
    mindArr.map((data) => {
      mind += Number(data.question_Point);
    });

    let bodyArr = await ConnectionUtil(
      `SELECT sn.healthQuestions_Id, sn.user_Id , sn.company_Id , sn.score , sn.question_Point , sn.options FROM user_hrasubmission sn JOIN user_hrasubmit st
  ON 
  (sn.user_Id = st.user_Id)
  WHERE sn.healthQuestions_Id IN (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28) AND st.status = 1 AND sn.status='1'`
    );

    let body = 0;
    bodyArr.map((data) => {
      body += Number(data.question_Point);
    });
    body += sum;

    let total = Math.round((totalHra / totalHraArr.length / 100) * 100);
    let lifestyleData = Math.ceil((lifestyle / totalHraArr.length / 30) * 100);
    let bodyData = Math.ceil((body / totalHraArr.length / 51) * 100);
    let mindData = Math.ceil((mind / totalHraArr.length / 19) * 100);
    let empParticipanting_program = totalHraArr.length;

    let obj={
      agreegatedRisk_score: [
        { score: diabetesRiskPercentage, name: "Diabetic" },
        { score: cardiovascularRiskPercentage, name: "Heart" },
        { score: obesityRiskPercentage, name: "Obesity" },
        { score: occupationalHealthRiskPercentage, name: "Occupational" },
        {
          score: mentalWellbeingOverallRiskPercentage,
          name: "Mental Wellbeing",
        },
      ],
      agreegatedCategories_score: [
        { score: personalPercentage, name: "personal" },
        { score: BiometricsPercentage, name: "Biometrics" },
        { score: clinicalHistoryPercentage, name: "Clinical History" },
        { score: screeningPercentage, name: "Screening" },
        { score: familyHistoryPercentage, name: "Family History" },
        { score: occupationalHistoryPercentage, name: "Occupational History" },
        { score: dietPercentage, name: "Lifestyle Diet" },
        { score: physicalActivityPercentage, name: "Physical Activity" },
        { score: tobaccoPercentage, name: "Tobacco" },
        { score: sleepPercentage, name: "Sleep" },
        { score: bevergesPercentage, name: "Alcohol" },
        { score: stressAndMentalWellbeingPercentage, name: "Mental WellBeing" },
      ],bmiAge: [
        { name: "20 - 35", value: bmiAge1 },
        { name: "36 - 50", value: bmiAge2 },
        { name: "51 - 65", value: bmiAge3 },
        { name: "65+", value: bmiAge4 },
      ],
      hra_point: {
        total, //avgHraScore,
        lifestyle: lifestyleData, //hraByCategory.lifestyle,
        body: bodyData, //hraByCategory.body,
        mind: mindData, //hraByCategory.mind,
      },
      userwellness_distribution: [
        { count: tot_high, name: "High" },
        { count: tot_medium, name: "Medium" },
        { count: tot_low, name: "Low" },
      ],
      bmiGender: [
        { gender: "Male", value: bmiGenderM },
        { gender: "Female", value: bmiGenderF },
      ],
      employeeReadiness: [
        {
          type: "underweight",
          number: 20,
        },
        {
          type: "normal",
          number: 50,
        },
        {
          type: "overweight",
          number: 72,
        },
        {
          type: "obese",
          number: 88,
        },
        {
          type: "mobidyobese",
          number: 84,
        },
      ],
        //wellness_distribution      : willness_point,
        Avg_hraScore               : val.total,
        lifestyle_score            : val.lifestyle,
        body_Score                 : val.body,
        mind_Score                 : val.mind,
        Avg_hraScoreImprovement    : 0 ,
        top_companiesByHRAScore	   : top_companyScore,    
        bottom_CompaniesByHRAScore : bottom_companyScore,
        top_categoriesByScore      : top_segmentScore,
        bottom_CategoriesByScore   : bottom_segmentScore,
        count_gender               : tot_gender,
        age_GroupGender            : 0 ,
        bmi_hrabasedGender         : 0 ,
        employees_participating    : tot_employeesParticipating ,
        employee_readiness         : employeeReadiness_Count.length>0?employeeReadiness_Count:[]
    }
    res.status(200).json({
      success: true,
      message: "HRA report detail",
      data: obj
    });
  }catch(err){
    console.log(err)
    res.status(404).json({
        success: false,
        message: err.message,
    });
  }
}
// select * from user_hrasubmission where  healthQuestions_Id=1 or healthQuestions_Id=2 or healthQuestions_Id=8 or healthQuestions_Id=9 

// "value" : "18-35",
// "value" : "36-50",
// "value" : "51-65"	 
// HRA - Super	User Wellness Distribution (Low, Medium, High)	Pie  Done
// 	Average HRA score - All	Speed meter       Done 
// 	Lifestyle score - All	Can be clubbed into 1 Radar Chart  Done 
// 	Body Score - All	  Done
// 	Mind Score - All	  Done 
// 	Average HRA Score Improvement	#    
// 	Top 5 Companies by HRA Score	Column    
// 	Bottom 5 Companies by HRA score	Column
// 	Top 3 Categories by score (out of 14 categories)	Column
// 	Bottom 3 Categories by score (out of 14 categories)	Column
// 	Respondend based on gender 	Pie
// 	BMI - Age group & Gender	Histogram
// 	# of employees participating in program	#
// 	Employee readiness	Traffic Light

async function hraRecode(data) {
    let userCount_body = 0;
    let userCount_mind = 0;
    let userCount_lifestyle = 0;
    let userSum_body = 0;
    let userSum_mind = 0;
    let userSum_lifestyle = 0;
    let val = await data.filter((recodeObj) => {
        if (recodeObj.category == "body") {
            userSum_body += recodeObj.avg;
            userCount_body += 1;
        }
        if (recodeObj.category == "mind") {
            userSum_mind += recodeObj.avg;
            userCount_mind += 1;
        }
        if (recodeObj.category == "lifestyle") {
            userSum_lifestyle += recodeObj.avg
            userCount_lifestyle += 1;
        }
    });
    let tot_body = userSum_body!=0  ?(userSum_body) / (userCount_body):0;
    let tot_mind = userSum_mind!=0  ?(userSum_mind) / (userCount_mind):0;
    let tot_lifestyle = userSum_lifestyle!=0 ?(userSum_lifestyle) /(userCount_lifestyle):0;
    let totalval =  (tot_body!=0) && (tot_mind!=0) && (tot_lifestyle!=0)? (tot_body + tot_mind + tot_lifestyle) /3:0;
    let obj = {
        body: Number(tot_body.toFixed(2)),
        mind: Number(tot_mind.toFixed(2)),
        lifestyle: Number(tot_lifestyle.toFixed(2)),
        total: Number(totalval.toFixed(2))
    }
    return obj;
}

module.exports.hra_genderData = async(req, res) =>{
  try{
    var maleCount = 0;
    var femaleCount = 0;
    var otherCount = 0;
    var nullCount = 0;
   
    var genderData = await ConnectionUtil(
      `SELECT user_id,gender from user WHERE isActive='1'AND status='1'`
    )
    console.log(genderData.length);
    for ( let i=0; i <= genderData.length - 1; i++){
      if(genderData[i].gender == null){
        nullCount++
      }
      if(genderData[i].gender != null){
      var gender = genderData[i].gender.toLowerCase()
      
      if(gender == "male"){
        maleCount++;
      }
      else if(gender == "female"){
        femaleCount++;
      } else{
        otherCount++;
      }
    }
 
  }
  console.log(nullCount,"nul values");

    var total_of_MaleCount = (maleCount / genderData.length * 100).toFixed(2) +'%';

      var total_of_FemaleCount = (femaleCount / genderData.length * 100).toFixed(2) +'%' ;

      var total_of_OtherCount = (otherCount / genderData.length * 100).toFixed(2) +'%'; 

      var total_of_null_count = (nullCount / genderData.length * 100).toFixed(2) +'%';
      var obj = {total_of_MaleCount, total_of_FemaleCount, total_of_OtherCount, total_of_null_count}
      res.status(200).json({
        success: true,
        message: "percentages of genders",
        data: obj
      })
  }catch(err){
    console.log(err)
    res.status(404).json({
        success: false,
        message: err.message,
    });
  }
} 