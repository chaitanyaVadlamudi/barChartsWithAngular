(function () {
    function configFun(ChartJsProvider) {
        ChartJsProvider.setOptions({
            //            chartColors: ['#FF5252', '#FF8A80', 'green'],
            //            responsive: true
        });
        // Configure all line charts
        ChartJsProvider.setOptions('line', {
            showLines: false
        });
    }

    function barCtrl($scope, barChartSvc, $interval) {

        $scope.reload = function () {
            barChartSvc.getDweets()
                .then(function (response) {
                    //console.log(response.data);
                    $scope.data = {};

                    $scope.mallData = []
                    $scope.feMaleCountArr = []
                    $scope.maleCountArr = []
                    $scope.kidsCountArr = []
                    $scope.mallData.push($scope.maleCountArr)
                    $scope.mallData.push($scope.feMaleCountArr)
                    $scope.mallData.push($scope.kidsCountArr)


                    $scope.pieChartData = []

                    $scope.keysArray = [];
                    $scope.countData = [];

                    $scope.dataOfDweet = response.data["with"];
                    // console.log($scope.dataOfDweet)

                    for (var i = 0; i < $scope.dataOfDweet.length; i++) {
                        // console.log(typeof ($scope.dataOfDweet[i].created));
                        var dateStrsArr = $scope.dataOfDweet[i].created.split('T')
                        var key = dateStrsArr[0] + ":" + (dateStrsArr[1].split(":")[0])
                        var tempArr = $scope.data[key];

                        if (tempArr == null) {

                            tempArr = []
                            $scope.data[key] = tempArr
                            $scope.keysArray.push(key);

                        }
                        tempArr.push($scope.dataOfDweet[i].content)

                    }
                    // console.log($scope.data)

                    for (var i = 0; i < $scope.keysArray.length; i++) {
                        var dweetsArr = $scope.data[$scope.keysArray[i]]
                        var maleCount = 0
                        var femaleCount = 0
                        var kidsCount = 0
                        for (var j = 0; j < dweetsArr.length; j++) {
                            var dweet = dweetsArr[j]
                            maleCount = maleCount + dweet.male
                            femaleCount = femaleCount + dweet.female
                            kidsCount = kidsCount + dweet.kids
                        }
                        //$scope.totalMaleCount = $scope.totalMaleCount + maleCount;
                        //$scope.totalFeMaleCount = $scope.totalFeMaleCount + femaleCount;
                        //$scope.totalKidsCount = $scope.totalKidsCount + kidsCount;

                        $scope.countData.push({
                            "Date": $scope.keysArray[i],
                            "MaleCount": maleCount,
                            "FemaleCount": femaleCount,
                            "KidsCount": kidsCount
                        })
                    }
                    console.log($scope.countData);

                    for (var i = 0; i < $scope.countData.length; i++) {
                        //console.log($scope.countData[i])
                        $scope.feMaleCountArr.push($scope.countData[i].FemaleCount)
                        $scope.maleCountArr.push($scope.countData[i].MaleCount)
                        $scope.kidsCountArr.push($scope.countData[i].KidsCount)

                    }
                    //  console.log($scope.mallData)

                    //Pie Chart Data
                    $scope.totalMaleCount = 0
                    $scope.totalFeMaleCount = 0
                    $scope.totalKidsCount = 0

                    $scope.pieChartData.length = 0;

                    for (var i = 0; i < $scope.dataOfDweet.length; i++) {
                        var dweet = $scope.dataOfDweet[i].content
                        $scope.totalMaleCount = $scope.totalMaleCount + dweet.male;
                        $scope.totalFeMaleCount = $scope.totalFeMaleCount + dweet.female;
                        $scope.totalKidsCount = $scope.totalKidsCount + dweet.kids;

                    }

                    $scope.pieChartData.push($scope.totalMaleCount)
                    $scope.pieChartData.push($scope.totalFeMaleCount)
                    $scope.pieChartData.push($scope.totalKidsCount)

                    console.log($scope.pieChartData)

                })
                .catch(function (error) {
                    console.log(error)
                });
        }
        $scope.reload();
        $interval($scope.reload, 10000);



        //$scope.time = ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4'];
        $scope.category = ['Male', 'Female', 'Kids'];
        $scope.options = {
            legend: {
                display: true
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Values'
                    }
    }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date:hr'
                    }
    }]
            }
        };


        $scope.labels = ["Male", "Female", "Kids"];
        // $scope.data = [436, 338, 145];
        $scope.pieChartOptions = {
            legend: {
                display: true
            }
        };
        /*$timeout(function () {
    $scope.mallData = [
        [40, 50, 30, 60, 30, 60, 80],
        [40, 60, 30 20, 60, 50, 70],
        [12, 10, 30, 5, 16, 50, 40]
            ];
}, 3000);*/

    }

    function pieChart($scope) {
        $scope.labels = ["male", "female", "kids"];
        // $scope.data = [436, 338, 145];
        $scope.options = {
            legend: {
                display: true
            }
        };

    }

    function barChartSvc($http) {
        this.getDweets = function () {
            return $http.get("https://thingspace.io/get/dweets/for/exp33");
        };

    }
    angular.module("barCharts", ["chart.js"])
        .config(["ChartJsProvider", configFun])
        .controller("barCtrl", ["$scope", "barChartSvc", "$interval", barCtrl])
        .controller("pieChart", ["$scope", pieChart])
        .service("barChartSvc", ["$http", barChartSvc])
})();
