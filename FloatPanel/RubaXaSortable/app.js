
var myapp = angular.module('sortableApp',['ngSanitize','toggle-switch']);


myapp.controller('sortableController', function ($scope) {

  $scope.init = function(){
            $scope.model="On";
            $scope.dataQuestion=
            {
              questions: [
                    {
                        "id":"54930130-3d7a-42c1-890c-9eece792fd80",
                        "type": "date",
                        "questionText": "What is your employment date for current employment?",
                        "mandatory": true
                    },
                    {
                        "id":"54930130-3d7a-42c1-890c-9eece792fd81",
                        "type": "optionyesno",
                        "questionText": "Have you worked in Engineering department during your employment",
                        "mandatory": false
                    },
                    {
                        "id":"54930130-3d7a-42c1-890c-9eece792fd83",
                        "type": "header",
                        "questionText": "Department question",
                        "mandatory": ""
                    },
                    {
                        "id":"54930130-3d7a-42c1-890c-9eece792fd84",
                        "type": "notePanel",
                        "questionText": "Note panel",
                        "mandatory": ""
                    }
                ]
            };

            $scope.tilesQuestion=$scope.dataQuestion.questions;
      }





 Sortable.create(listWithHandle, {
  handle: '.my-handle',
  animation: 150
});

   $scope.deleteQuestion = function(id){
        console.log("id a eliminar : "+id);
        $scope.idD=id;
        var deleteObject=null;
        angular.forEach($scope.tilesQuestion,function(value,key){
            if(value.id ==$scope.idD)
                deleteObject=key;
        });
        $scope.tilesQuestion.splice(deleteObject,1); 
    
    }
 
  
  
});


myapp.directive('ckedit', function ($parse) {
    CKEDITOR.disableAutoInline = true;
    var counter = 0,
    prefix = '__ckd_';

    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var getter = $parse(attrs.ckedit), 
                setter = getter.assign;
      
            attrs.$set('contenteditable', true); // inline ckeditor needs this
            if (!attrs.id) {
                attrs.$set('id', prefix + (++counter));
            }

            // CKEditor stuff
            // Override the normal CKEditor save plugin

            CKEDITOR.plugins.registered['save'] =
            {
                init: function (editor) {
                    editor.addCommand('save',
                        {
                            modes: { wysiwyg: 1, source: 1 },
                            exec: function (editor) {
                                if (editor.checkDirty()) {
                                    var ckValue = editor.getData();
                                    scope.$apply(function () {
                                        setter(scope, ckValue);
                                    });
                                    ckValue = null;
                                    editor.resetDirty();
                                }
                            }
                        }
                    );
                    editor.ui.addButton('Save', { label: 'Save', command: 'save', toolbar: 'document' });
                }
            };
            var options = {};
            options.on = {
                blur: function (e) {
                    if (e.editor.checkDirty()) {
                        var ckValue = e.editor.getData();
                        scope.$apply(function () {
                            setter(scope, ckValue);
                        });
                        ckValue = null;
                        e.editor.resetDirty();
                    }
                }
            };
            options.extraPlugins = 'sourcedialog';
            options.removePlugins = 'sourcearea';
            options.toolbarGroups= [{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] }];
            var editorangular = CKEDITOR.inline(element[0], options); //invoke

            scope.$watch(attrs.ckedit, function (value) {
                editorangular.setData(value);
            });
        }
    }
    
});