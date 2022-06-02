//Static Key set 
module.exports = { 
//folder superAdmin
// --------- create company ---------    
workingDay: `[{"id":1,"day":"Sunday","inTime":"","outTime":"","OnOff":true},{"id":2,"day":"Monday","inTime":"14:27","outTime":"18:25","OnOff":true},{"id":3,"day":"Tuesday","inTime":"14:27","outTime":"14:28","OnOff":false},{"id":4,"day":"Wednesday","inTime":"","outTime":"","OnOff":false},{"id":5,"day":"Thursday","inTime":"","outTime":"","OnOff":false},{"id":6,"day":"Friday","inTime":"","outTime":"","OnOff":false},{"id":7,"day":"Saturday(1,3,5)","inTime":"","outTime":"","OnOff":true},{"id":8,"day":"Saturday(2,4)","inTime":"","outTime":"","OnOff":true}]`,
access_Modules:`[{"both": true, "name": "Dashboard", "read": true, "write": true, "children": [], "access_id": 7}, {"both": true, "name": "Calendar", "read": true, "write": true, "children": [], "access_id": 8}, {"both": true, "name": "Chat", "read": true, "write": true, "children": [], "access_id": 9}, {"both": true, "name": "Employees", "read": true, "write": true, "children": [], "access_id": 10}, {"both": true, "name": "Roles & access", "read": true, "write": true, "children": [{"both": true, "name": "User roles", "read": true, "write": true, "children": [], "access_id": 12}, {"both": true, "name": "Access", "read": true, "write": true, "children": [], "access_id": 13}], "access_id": 11}, {"both": true, "name": "Documents", "read": true, "write": true, "children": [{"both": true, "name": "Contracts", "read": true, "write": true, "children": [], "access_id": 15}, {"both": true, "name": "Ids", "read": true, "write": true, "children": [], "access_id": 16}, {"both": true, "name": "Others", "read": true, "write": true, "children": [], "access_id": 17}], "access_id": 14}, {"both": true, "name": "Announcements", "read": true, "write": true, "children": [], "access_id": 18}, {"both": true, "name": "Salary Management", "read": true, "write": true, "children": [{"both": true, "name": "Employee Salary", "read": true, "write": true, "children": [], "access_id": 20}, {"both": true, "name": "Payslips", "read": true, "write": true, "children": [], "access_id": 21}], "access_id": 19}, {"both": true, "name": "Surveys", "read": true, "write": true, "children": [{"both": true, "name": "Active Survey", "read": true, "write": true, "children": [], "access_id": 23}, {"both": true, "name": "Create New", "read": true, "write": true, "children": [], "access_id": 24}, {"both": true, "name": "Initial Survey", "read": true, "write": true, "children": [], "access_id": 25}, {"both": true, "name": "Response & Status", "read": true, "write": true, "children": [], "access_id": 26}], "access_id": 22}, {"both": true, "name": "Reports", "read": true, "write": true, "children": [], "access_id": 27}, {"both": true, "name": "Health & Wellness", "read": true, "write": true, "children": [], "access_id": 28}, {"both": true, "name": "Insurance", "read": true, "write": true, "children": [], "access_id": 29}, {"both": true, "name": "Rewards", "read": true, "write": true, "children": [{"both": true, "name": "Active Reward", "read": true, "write": true, "children": [], "access_id": 31}, {"both": true, "name": "Create Reward", "read": true, "write": true, "children": [], "access_id": 32}, {"both": true, "name": "Initial Reward", "read": true, "write": true, "children": [], "access_id": 33}, {"both": true, "name": "Report", "read": true, "write": true, "children": [], "access_id": 34}], "access_id": 30}, {"both": true, "name": "Company Profile", "read": true, "write": true, "children": [{"both": true, "name": "Profile", "read": true, "write": true, "children": [], "access_id": 36}, {"both": true, "name": "FAQs", "read": true, "write": true, "children": [], "access_id": 37}], "access_id": 35}, {"both": true, "name": "Settings", "read": true, "write": true, "children": [], "access_id": 38}]`,
branchAccess:[{module:'Dashboard',permission:1},{module:'Calendar',permission:1},{module:'Messaging',permission:1},{module:'Employees',permission:1},{module:'Leaves',permission:1},{module:'Documents',permission:1},{module:'Announcement',permission:1},{module:'Salary Management',permission:1},{module:'Surveys',permission:1},{module:'Reports',permission:1},{module:'Health & Wellnesss',permission:1},{module:'Insurance',permission:1},{module:'Rewards',permission:1},{module:'Challenges',permission:1},{module:'Coaching',permission:1}]
// --------- create company ---------


};