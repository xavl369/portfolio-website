/** *************Angular controller JS*********************/
"use strict"; 
app.controller('ContactController', function ($scope, $http) {
    $scope.result = 'hidden'
    $scope.resultMessage;
    $scope.formData; //formData is an object holding the name, email, subject, and message
    $scope.submitButtonDisabled = false;
    $scope.submitted = false; //used so that form errors are shown only after the form has been submitted
    $scope.submit = function(contactform, e) {
        e.preventDefault();
        $scope.submitted = true;
        $scope.submitButtonDisabled = true;
        if (contactform.$valid) {
            $http({
                method  : 'POST',
                url     : 'https://api.web3forms.com/submit',
                data    : {
                    access_key: '68739825-f9ca-4147-8b63-67b4a66a520f', // <-- replace this after signing up at web3forms.com
                    name: $scope.formData.inputName,
                    email: $scope.formData.inputEmail,
                    message: $scope.formData.inputMessage
                },
                headers : { 'Content-Type': 'application/json' }
            }).then(function(response){
                var data = response.data;
                if (data.success) {
                    $scope.submitButtonDisabled = false;
                    $scope.formData = null;
                    $scope.submitted = false;
                    $scope.resultMessage = 'Message sent successfully!';
                    $scope.result='bg-success';
                } else {
                    $scope.submitButtonDisabled = false;
                    $scope.resultMessage = 'Failed :( Please try again.';
                    $scope.result='bg-danger';
                }
            }, function(error){
                $scope.submitButtonDisabled = false;
                $scope.resultMessage = 'Failed :( Please try again.';
                $scope.result='bg-danger';
            });
        } else {
            $scope.submitButtonDisabled = false;
            $scope.resultMessage = 'Failed :( Please fill out all the fields.';
            $scope.result='bg-danger';
        }
    }
});