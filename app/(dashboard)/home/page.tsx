"use client"
import React from 'react';
import Image from 'next/image';
import logo from '../../../public/Logo-03.png';
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../component/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../component/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../component/ui/select"
import { AreaChart, BarChart, ChartContainer, LineChart, PieChart } from "../../../component/ui/chart"
import { ArrowUpRight, Users, Activity, Weight } from "lucide-react"
import { MilkIcon as Cow } from "lucide-react"
import LivestockInsuranceModal from '@/component/modal/LivestockInsuranceModal';
import ModalGeneral from '@/component/modal/DialogGeneral';

export default function DashboardPage() {
  type CowKey = "all" | "cow-1" | "cow-2" | "cow-3";
  const [selectedCow, setSelectedCow] = useState<CowKey>("all")
  const [timeRange, setTimeRange] = useState("year")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGeneralModalOpen, setIsGeneralModalOpen] = useState(false)

  // Sample data for farmer registrations over time
  const farmerRegistrationData = [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 18 },
    { month: "Mar", count: 24 },
    { month: "Apr", count: 32 },
    { month: "May", count: 38 },
    { month: "Jun", count: 45 },
    { month: "Jul", count: 51 },
    { month: "Aug", count: 57 },
    { month: "Sep", count: 63 },
    { month: "Oct", count: 68 },
    { month: "Nov", count: 72 },
    { month: "Dec", count: 78 },
  ]

  // Sample data for cow registrations over time
  const cowRegistrationData = [
    { month: "Jan", count: 25 },
    { month: "Feb", count: 38 },
    { month: "Mar", count: 52 },
    { month: "Apr", count: 61 },
    { month: "May", count: 75 },
    { month: "Jun", count: 89 },
    { month: "Jul", count: 102 },
    { month: "Aug", count: 118 },
    { month: "Sep", count: 132 },
    { month: "Oct", count: 145 },
    { month: "Nov", count: 158 },
    { month: "Dec", count: 172 },
  ]

  // Sample data for cow weight over time
  const cowWeightData = {
    all: [
      { week: "Week 1", weight: 450 },
      { week: "Week 5", weight: 465 },
      { week: "Week 9", weight: 480 },
      { week: "Week 13", weight: 495 },
      { week: "Week 17", weight: 510 },
      { week: "Week 21", weight: 525 },
    ],
    "cow-1": [
      { week: "Week 1", weight: 420 },
      { week: "Week 5", weight: 440 },
      { week: "Week 9", weight: 460 },
      { week: "Week 13", weight: 480 },
      { week: "Week 17", weight: 500 },
      { week: "Week 21", weight: 520 },
    ],
    "cow-2": [
      { week: "Week 1", weight: 480 },
      { week: "Week 5", weight: 490 },
      { week: "Week 9", weight: 500 },
      { week: "Week 13", weight: 510 },
      { week: "Week 17", weight: 520 },
      { week: "Week 21", weight: 530 },
    ],
    "cow-3": [
      { week: "Week 1", weight: 450 },
      { week: "Week 5", weight: 465 },
      { week: "Week 9", weight: 470 },
      { week: "Week 13", weight: 485 },
      { week: "Week 17", weight: 500 },
      { week: "Week 21", weight: 515 },
    ],
  }

  // Sample data for cattle type distribution
  const cattleTypeData = [
    { name: "Dairy", value: 45 },
    { name: "Beef", value: 30 },
    { name: "Dual Purpose", value: 15 },
    { name: "Stud Bulls", value: 10 },
  ]

  // Sample data for health metrics
  const healthMetricsData = [
    { month: "Jan", healthy: 85, sick: 15 },
    { month: "Feb", healthy: 82, sick: 18 },
    { month: "Mar", healthy: 88, sick: 12 },
    { month: "Apr", healthy: 90, sick: 10 },
    { month: "May", healthy: 87, sick: 13 },
    { month: "Jun", healthy: 85, sick: 15 },
    { month: "Jul", healthy: 89, sick: 11 },
    { month: "Aug", healthy: 92, sick: 8 },
    { month: "Sep", healthy: 90, sick: 10 },
    { month: "Oct", healthy: 88, sick: 12 },
    { month: "Nov", healthy: 91, sick: 9 },
    { month: "Dec", healthy: 93, sick: 7 },
  ]

  // Combined data for registration overview
  const registrationOverviewData = farmerRegistrationData.map((item, index) => ({
    month: item.month,
    Farmers: item.count,
    Cattle: cowRegistrationData[index].count,
  }))

  // Combined data for weight comparison
  const weightComparisonData = cowWeightData["cow-1"].map((item) => ({
    week: item.week,
    "Cow #1": item.weight,
    "Cow #2": cowWeightData["cow-2"].find((i) => i.week === item.week)?.weight,
    "Cow #3": cowWeightData["cow-3"].find((i) => i.week === item.week)?.weight,
  }))

  return (
    <div className="flex min-h-screen w-full flex-col">
         <div className="my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#228C45] shadow-md rounded-lg p-4 flex text-white flex-col justify-center">
                    <h2 className="text-lg font-semibold">Livestock insurance</h2>
                    <p className="">Check out our insurance services for cattle</p>
                    <button onClick={()=>{setIsModalOpen(true)}} className='bg-[#016630] w-40 text-white p-2 mt-5 rounded-2xl self-center cursor-pointer hover:bg-green-600'>
                        Apply
                    </button>
                </div>
                <div className="bg-[#228C45] shadow-md rounded-lg p-4 flex text-white flex-col justify-center">
                    <h2 className="text-lg font-semibold">Health insurance</h2>
                    <p className="">Check out our insurance services for Health</p>
                    <button onClick={()=>{setIsGeneralModalOpen(true)}} className='bg-[#016630] w-40 text-white p-2 mt-5 rounded-2xl self-center cursor-pointer hover:bg-green-600'>
                        Apply
                    </button>
                </div>
                <div className="bg-[#228C45] shadow-md rounded-lg p-4 flex text-white flex-col justify-center">
                    <h2 className="text-lg font-semibold">Life insurance</h2>
                    <p className="">Check out our insurance services for Life</p>
                    <button  onClick={()=>{setIsGeneralModalOpen(true)}} className='bg-[#016630] w-40 text-white p-2 mt-5 rounded-2xl self-center cursor-pointer hover:bg-green-600'>
                        Apply
                    </button>
                </div>
            </div>
            {false && (
  <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-green-300 bg-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  +8.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border border-green-300 bg-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cattle</CardTitle>
              <Cow className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">172</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  +12.3% <ArrowUpRight className="ml-1 h-3 w-3" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border border-green-300 bg-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Healthy Cattle</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  +2.1% <ArrowUpRight className="ml-1 h-3 w-3" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
          <Card className="border border-green-300 bg-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Weight</CardTitle>
              <Weight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">525 kg</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  +3.2% <ArrowUpRight className="ml-1 h-3 w-3" />
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4 border border-green-300">
                <CardHeader>
                  <CardTitle>Registrations Overview</CardTitle>
                  <CardDescription>Comparison of farmer and cattle registrations over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      Farmers: { label: "Farmers", color: "hsl(142, 76%, 36%)" },
                      Cattle: { label: "Cattle", color: "hsl(143, 64%, 49%)" },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart
                      data={registrationOverviewData}
                      index="month"
                      categories={["Farmers", "Cattle"]}
                      colors={["hsl(142, 76%, 36%)", "hsl(143, 64%, 49%)"]}
                      valueFormatter={(value) => `${value} registered`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3 border border-green-300">
                <CardHeader>
                  <CardTitle>Cattle Type Distribution</CardTitle>
                  <CardDescription>Breakdown of cattle by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Value", color: "hsl(142, 76%, 36%)" },
                    }}
                    className="h-[300px]"
                  >
                    <PieChart
                      data={cattleTypeData}
                      index="name"
                      categories={["value"]}
                      colors={["hsl(142, 76%, 36%)", "hsl(143, 64%, 49%)", "hsl(160, 84%, 39%)", "hsl(166, 76%, 41%)"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3 border border-green-300">
                <CardHeader>
                  <CardTitle>Health Status</CardTitle>
                  <CardDescription>Monthly health status of cattle</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      healthy: { label: "Healthy", color: "hsl(142, 76%, 36%)" },
                      sick: { label: "Sick", color: "hsl(0, 84%, 60%)" },
                    }}
                    className="h-[300px]"
                  >
                    <BarChart
                      data={healthMetricsData}
                      index="month"
                      categories={["healthy", "sick"]}
                      colors={["hsl(142, 76%, 36%)", "hsl(0, 84%, 60%)"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="lg:col-span-4 border border-green-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Cattle Weight Tracking</CardTitle>
                    <CardDescription>Average weight progression over time</CardDescription>
                  </div>
                  <Select value={selectedCow} onValueChange={(value) => setSelectedCow(value as CowKey)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select cow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cattle (Avg)</SelectItem>
                      <SelectItem value="cow-1">Cow #1</SelectItem>
                      <SelectItem value="cow-2">Cow #2</SelectItem>
                      <SelectItem value="cow-3">Cow #3</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      weight: { label: "Weight", color: "hsl(142, 76%, 36%)" },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={cowWeightData[selectedCow]}
                      index="week"
                      categories={["weight"]}
                      colors={["hsl(142, 76%, 36%)"]}
                      valueFormatter={(value) => `${value} kg`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border border-green-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Farmer Registrations</CardTitle>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="quarter">Quarter</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription>Number of new farmers registered over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      count: { label: "Count", color: "hsl(142, 76%, 36%)" },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={farmerRegistrationData}
                      index="month"
                      categories={["count"]}
                      colors={["hsl(142, 76%, 36%)"]}
                      valueFormatter={(value) => `${value} farmers`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="border border-green-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Cattle Registrations</CardTitle>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="quarter">Quarter</SelectItem>
                        <SelectItem value="year">Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription>Number of new cattle registered over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      count: { label: "Count", color: "hsl(142, 76%, 36%)" },
                    }}
                    className="h-[300px]"
                  >
                    <BarChart
                      data={cowRegistrationData}
                      index="month"
                      categories={["count"]}
                      colors={["hsl(142, 76%, 36%)"]}
                      valueFormatter={(value) => `${value} cattle`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-green-300">
              <CardHeader>
                <CardTitle>Registration Comparison</CardTitle>
                <CardDescription>Monthly comparison between farmer and cattle registrations</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    Farmers: { label: "Farmers", color: "hsl(142, 76%, 36%)" },
                    Cattle: { label: "Cattle", color: "hsl(143, 64%, 49%)" },
                  }}
                  className="h-[400px]"
                >
                  <BarChart
                    data={registrationOverviewData}
                    index="month"
                    categories={["Farmers", "Cattle"]}
                    colors={["hsl(142, 76%, 36%)", "hsl(143, 64%, 49%)"]}
                    valueFormatter={(value) => `${value} registered`}
                    className="h-[400px]"
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border border-green-300">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Individual Cow Weight Tracking</CardTitle>
                    <CardDescription>Weight progression for selected cow</CardDescription>
                  </div>
                  <Select value={selectedCow} onValueChange={(value) => setSelectedCow(value as CowKey)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select cow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cattle (Avg)</SelectItem>
                      <SelectItem value="cow-1">Cow #1</SelectItem>
                      <SelectItem value="cow-2">Cow #2</SelectItem>
                      <SelectItem value="cow-3">Cow #3</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      weight: { label: "Weight", color: "hsl(142, 76%, 36%)" },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={cowWeightData[selectedCow]}
                      index="week"
                      categories={["weight"]}
                      colors={["hsl(142, 76%, 36%)"]}
                      valueFormatter={(value) => `${value} kg`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="border border-green-300">
                <CardHeader>
                  <CardTitle>Health Status Trend</CardTitle>
                  <CardDescription>Percentage of healthy vs. sick cattle over time</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ChartContainer
                    config={{
                      healthy: { label: "Healthy", color: "hsl(142, 76%, 36%)" },
                      sick: { label: "Sick", color: "hsl(0, 84%, 60%)" },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart
                      data={healthMetricsData}
                      index="month"
                      categories={["healthy", "sick"]}
                      colors={["hsl(142, 76%, 36%)", "hsl(0, 84%, 60%)"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-[300px]"
                    />
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-green-300">
              <CardHeader>
                <CardTitle>Comparative Weight Analysis</CardTitle>
                <CardDescription>Weight comparison between different cattle</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    "Cow #1": { label: "Cow #1", color: "hsl(142, 76%, 36%)" },
                    "Cow #2": { label: "Cow #2", color: "hsl(143, 64%, 49%)" },
                    "Cow #3": { label: "Cow #3", color: "hsl(166, 76%, 41%)" },
                  }}
                  className="h-[400px]"
                >
                  <LineChart
                    data={weightComparisonData}
                    index="week"
                    categories={["Cow #1", "Cow #2", "Cow #3"]}
                    colors={["hsl(142, 76%, 36%)", "hsl(143, 64%, 49%)", "hsl(166, 76%, 41%)"]}
                    valueFormatter={(value) => `${value} kg`}
                    className="h-[400px]"
                  />
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
            )}
    
      <LivestockInsuranceModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); } } />
      <ModalGeneral isOpen={isGeneralModalOpen} onClose={() => {setIsGeneralModalOpen(false)}}>
        <div className='text-black  text-center flex flex-col items-center p-5'>
        <Image
                    src={logo}
                    alt="Logo"
                    width={200}
                    height={200}
                    className="h-auto "
                    priority
                    
                />
          Stay tuned! Exciting new features are coming soon.
        </div>
      </ModalGeneral>
    </div>
  )
}
