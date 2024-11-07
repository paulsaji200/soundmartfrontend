
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar } from '@/components/ui/avatar';

const data = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 1500 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2500 },
  { name: 'May', value: 3000 },
  { name: 'Jun', value: 3500 },
  { name: 'Jul', value: 4000 },
  { name: 'Aug', value: 4500 },
  { name: 'Sep', value: 5000 },
  { name: 'Oct', value: 5500 },
];

const recentSales = [
  { name: 'Megan Markle', amount: 263099.00, time: '5 minutes ago' },
  { name: 'Amy', amount: 45922.00, time: '15 minutes ago' },
  { name: 'James B', amount: 61231.00, time: '30 minutes ago' },
  { name: 'Jameson', amount: 23342.00, time: '1 hr ago' },
  { name: 'andrea', amount: 79239.00, time: '1 hr ago' },
  { name: 'alfred', amount: 6590.00, time: '2 hrs ago' },
  { name: 'athul', amount: 399.00, time: '2 hrs ago' },
  { name: 'Aswin', amount: 299.00, time: '3 hrs ago' },
  { name: 'harvey', amount: 998.00, time: '3 hrs ago' },
  { name: 'Hans', amount: 450.00, time: '4 hrs ago' },
];

const SalesDashboard = () => {
  return (
    <div className="p-4 bg-gray-100">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Card className="bg-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ 5,55,000</div>
          </CardContent>
        </Card>
        <Card className="bg-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,500</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,500</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,013</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-9 w-9" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">{sale.time}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    ₹{sale.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesDashboard;