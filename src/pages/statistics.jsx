// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Users, UserCheck, UserX, TrendingUp, Database } from 'lucide-react'; // @ts-ignore;
import { useToast } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
const COLORS = ['#1e40af', '#059669', '#dc2626'];
export default function Statistics(props) {
  const {
    toast } =
  useToast();
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    realUsers: 0,
    virtualUsers: 0,
    loading: true });

  const [userList, setUserList] = useState([]);

  // 获取用户统计数据
  // 获取用户统计数据
  const fetchUserStatistics = async () => {try {
      const tcb = await props.$w.cloud.getCloudInstance();

      // 查询所有用户 - 使用 count 获取总数
      // 查询所有用户 - 使用 count 获取总数
      const countResult = await tcb.database().collection('aa_user').count();const totalCount = countResult.total || 0;

      // 获取用户列表用于详细展示（限制数量避免性能问题）
      // 获取用户列表用于详细展示（限制数量避免性能问题）
      const userResult = await tcb.database().collection('aa_user').limit(100).get();const users = userResult.data || [];

      // 统计用户数据（基于获取的样本）
      // 统计用户数据（基于获取的样本）
      let realUsers = 0;let virtualUsers = 0;
      users.forEach((user) => {
        // 如果存在 isVirtual 字段，则根据该字段统计
        // 如果不存在，则默认为真实用户
        if (user.isVirtual === true) {
          virtualUsers++;
        } else {
          realUsers++;
        }
      });

      // 根据样本比例估算总数（如果样本数量小于总数）
      // 根据样本比例估算总数（如果样本数量小于总数）
      if (users.length < totalCount) {const sampleRatio = users.length / totalCount;
        realUsers = Math.round(realUsers / sampleRatio);
        virtualUsers = Math.round(virtualUsers / sampleRatio);
      }
      // 调试信息：显示实际统计结果
      // 调试信息：显示实际统计结果
      console.log('用户统计结果:', { totalCount,
        sampleSize: users.length,
        realUsers,
        virtualUsers,
        sampleRealUsers: users.filter((u) => u.isVirtual !== true).length,
        sampleVirtualUsers: users.filter((u) => u.isVirtual === true).length });

      setStatistics({
        totalUsers: totalCount,
        realUsers,
        virtualUsers,
        loading: false });

      setUserList(users.slice(0, 10)); // 显示前10个用户作为示例
    } catch (error) {
      console.error('获取用户统计数据失败:', error);
      toast({
        title: '获取数据失败',
        description: error.message || '无法获取用户统计数据',
        variant: 'destructive' });

      setStatistics((prev) => ({
        ...prev,
        loading: false }));

    }
  };
  useEffect(() => {
    fetchUserStatistics();
  }, []);

  // 图表数据
  // 图表数据
  const pieData = [{ name: '真实用户',
    value: statistics.realUsers,
    color: '#1e40af' },
  {
    name: '虚拟用户',
    value: statistics.virtualUsers,
    color: '#dc2626' }];

  const barData = [{
    name: '总用户',
    value: statistics.totalUsers },
  {
    name: '真实用户',
    value: statistics.realUsers },
  {
    name: '虚拟用户',
    value: statistics.virtualUsers }];

  if (statistics.loading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-lg font-medium text-gray-600">加载统计数据中...</span>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{
          fontFamily: 'Playfair Display' }}>

            用户统计分析
          </h1>
          <p className="text-gray-600">实时监控用户数据，洞察用户行为趋势</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">总用户数</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>实时统计</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">真实用户</p>
                <p className="text-3xl font-bold text-green-600">{statistics.realUsers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span>占比 {statistics.totalUsers > 0 ? (statistics.realUsers / statistics.totalUsers * 100).toFixed(1) : 0}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">虚拟用户1</p>
                <p className="text-3xl font-bold text-orange-600">{statistics.virtualUsers}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <UserX className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span>占比 {statistics.totalUsers > 0 ? (statistics.virtualUsers / statistics.totalUsers * 100).toFixed(1) : 0}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">数据状态</p>
                <p className="text-3xl font-bold text-blue-600">实时</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span>数据已同步</span>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 饼图 */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4" style={{
            fontFamily: 'Playfair Display' }}>

              用户类型分布
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({
                  name,
                  percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 柱状图 */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4" style={{
            fontFamily: 'Playfair Display' }}>

              用户数量对比
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900" style={{
            fontFamily: 'Playfair Display' }}>

              最近用户 (显示前10个)
            </h3>
            <p className="text-gray-600 mt-1">展示最新的用户数据</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userList.map((user, index) => <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={user.avatarUrl || 'https://via.placeholder.com/40'} alt={user.nickName || '用户'} onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40';
                    }} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.nickName || '匿名用户'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.openid?.substring(0, 10)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isVirtual ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                        {user.isVirtual ? '虚拟用户' : '真实用户'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        活跃
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={fetchUserStatistics} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
            <span>刷新数据</span>
          </button>
          <button onClick={() => {
          toast({
            title: '功能开发中',
            description: '导出功能正在开发中，敬请期待' });

        }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            导出数据
          </button>
        </div>
      </div>
    </div>;
}