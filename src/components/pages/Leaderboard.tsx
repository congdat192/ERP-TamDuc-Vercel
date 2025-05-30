
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Star,
  Target
} from 'lucide-react';

const dailyLeaderboard = [
  { 
    rank: 1, 
    name: 'Phạm Thị Minh', 
    issued: 23, 
    used: 21, 
    conversion: 91, 
    avatar: '/placeholder.svg',
    change: 2,
    badge: 'Nhà Vô Địch Ngày'
  },
  { 
    rank: 2, 
    name: 'Lê Minh Cường', 
    issued: 21, 
    used: 18, 
    conversion: 86, 
    avatar: '/placeholder.svg',
    change: -1,
    badge: null
  },
  { 
    rank: 3, 
    name: 'Nguyễn Văn An', 
    issued: 19, 
    used: 17, 
    conversion: 89, 
    avatar: '/placeholder.svg',
    change: 1,
    badge: null
  },
  { 
    rank: 4, 
    name: 'Trần Thị Bình', 
    issued: 18, 
    used: 15, 
    conversion: 83, 
    avatar: '/placeholder.svg',
    change: 0,
    badge: null
  },
  { 
    rank: 5, 
    name: 'Vũ Thanh Hải', 
    issued: 16, 
    used: 14, 
    conversion: 88, 
    avatar: '/placeholder.svg',
    change: 3,
    badge: 'Ngôi Sao Mới'
  }
];

const weeklyLeaderboard = [
  { 
    rank: 1, 
    name: 'Lê Minh Cường', 
    issued: 142, 
    used: 125, 
    conversion: 88, 
    avatar: '/placeholder.svg',
    change: 1,
    badge: 'Nhà Vô Địch Tuần'
  },
  { 
    rank: 2, 
    name: 'Phạm Thị Minh', 
    issued: 138, 
    used: 122, 
    conversion: 88, 
    avatar: '/placeholder.svg',
    change: -1,
    badge: null
  },
  { 
    rank: 3, 
    name: 'Nguyễn Văn An', 
    issued: 134, 
    used: 115, 
    conversion: 86, 
    avatar: '/placeholder.svg',
    change: 2,
    badge: null
  },
  { 
    rank: 4, 
    name: 'Trần Thị Bình', 
    issued: 128, 
    used: 108, 
    conversion: 84, 
    avatar: '/placeholder.svg',
    change: -1,
    badge: null
  },
  { 
    rank: 5, 
    name: 'Vũ Thanh Hải', 
    issued: 121, 
    used: 103, 
    conversion: 85, 
    avatar: '/placeholder.svg',
    change: 0,
    badge: null
  }
];

const monthlyLeaderboard = [
  { 
    rank: 1, 
    name: 'Nguyễn Văn An', 
    issued: 564, 
    used: 487, 
    conversion: 86, 
    avatar: '/placeholder.svg',
    change: 0,
    badge: 'Nhà Vô Địch Tháng'
  },
  { 
    rank: 2, 
    name: 'Lê Minh Cường', 
    issued: 548, 
    used: 468, 
    conversion: 85, 
    avatar: '/placeholder.svg',
    change: 1,
    badge: null
  },
  { 
    rank: 3, 
    name: 'Phạm Thị Minh', 
    issued: 532, 
    used: 461, 
    conversion: 87, 
    avatar: '/placeholder.svg',
    change: -1,
    badge: 'Tỷ Lệ Chuyển Đổi Tốt Nhất'
  },
  { 
    rank: 4, 
    name: 'Trần Thị Bình', 
    issued: 498, 
    used: 412, 
    conversion: 83, 
    avatar: '/placeholder.svg',
    change: 1,
    badge: null
  },
  { 
    rank: 5, 
    name: 'Vũ Thanh Hải', 
    issued: 476, 
    used: 398, 
    conversion: 84, 
    avatar: '/placeholder.svg',
    change: -1,
    badge: null
  }
];

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState('daily');

  const getCurrentLeaderboard = () => {
    switch (activeTab) {
      case 'daily':
        return dailyLeaderboard;
      case 'weekly':
        return weeklyLeaderboard;
      case 'monthly':
        return monthlyLeaderboard;
      default:
        return dailyLeaderboard;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeText = (change: number) => {
    if (change > 0) return `+${change}`;
    if (change < 0) return change.toString();
    return '→';
  };

  const getBadgeIcon = (badge: string | null) => {
    if (!badge) return null;
    if (badge.includes('Vô Địch')) return <Trophy className="w-4 h-4" />;
    if (badge.includes('Ngôi Sao')) return <Star className="w-4 h-4" />;
    if (badge.includes('Tỷ Lệ')) return <Target className="w-4 h-4" />;
    return <Award className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span>Bảng Xếp Hạng Telesales</span>
        </h2>
        <p className="text-gray-600">Theo dõi hiệu suất và chúc mừng những thành tích xuất sắc</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="daily">Hàng Ngày</TabsTrigger>
            <TabsTrigger value="weekly">Hàng Tuần</TabsTrigger>
            <TabsTrigger value="monthly">Hàng Tháng</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Top 3 Podium */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-end space-x-8 mb-8">
                {getCurrentLeaderboard().slice(0, 3).map((person, index) => {
                  const actualRank = person.rank;
                  return (
                    <div key={person.name} className={`flex flex-col items-center ${index === 1 ? 'order-1' : index === 0 ? 'order-2' : 'order-3'}`}>
                      <Avatar className="w-16 h-16 mb-3 border-4 border-yellow-400">
                        <AvatarImage src={person.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                          {person.name.split(' ').slice(-1)[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-center mb-1">{person.name}</h3>
                      <Badge variant="secondary" className="mb-2">{person.issued} voucher</Badge>
                      <div className={`${['h-24', 'h-32', 'h-20'][index]} w-20 bg-gradient-to-t ${
                        actualRank === 1 ? 'from-yellow-400 to-yellow-500' :
                        actualRank === 2 ? 'from-gray-300 to-gray-400' :
                        'from-amber-500 to-amber-600'
                      } rounded-t-lg flex items-end justify-center pb-2`}>
                        <span className="text-white font-bold text-xl">{actualRank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Medal className="w-5 h-5" />
                <span>Bảng Xếp Hạng Đầy Đủ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getCurrentLeaderboard().map((person, index) => (
                  <div 
                    key={person.name} 
                    className={`flex items-center p-4 rounded-lg transition-all ${
                      person.rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-12 h-12 mr-4">
                      {getRankIcon(person.rank)}
                    </div>

                    {/* Avatar and Name */}
                    <div className="flex items-center space-x-3 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={person.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {person.name.split(' ').slice(-1)[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{person.name}</h4>
                        {person.badge && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            {getBadgeIcon(person.badge)}
                            <span className="ml-1">{person.badge}</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{person.issued}</div>
                        <div className="text-gray-500">Đã Phát</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{person.used}</div>
                        <div className="text-gray-500">Đã Dùng</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{person.conversion}%</div>
                        <div className="text-gray-500">Tỷ Lệ</div>
                      </div>
                    </div>

                    {/* Rank Change */}
                    <div className="flex items-center space-x-1 ml-6">
                      {getChangeIcon(person.change)}
                      <span className={`text-sm font-medium ${
                        person.change > 0 ? 'text-green-600' : 
                        person.change < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {getChangeText(person.change)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Thành Tích Gần Đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-yellow-800">Nhà Vô Địch Ngày</h4>
                  <p className="text-sm text-yellow-600">Phạm Thị Minh - 23 voucher đã phát</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Tỷ Lệ Chuyển Đổi Tốt Nhất</h4>
                  <p className="text-sm text-green-600">Phạm Thị Minh - 91% tỷ lệ chuyển đổi</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800">Ngôi Sao Mới</h4>
                  <p className="text-sm text-blue-600">Vũ Thanh Hải - tăng +3 bậc xếp hạng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
