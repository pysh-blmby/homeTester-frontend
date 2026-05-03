import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, Search } from 'lucide-react';

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLabs();
  }, []);

  const fetchLabs = async (searchQuery = '') => {
    setIsLoading(true);
    try {
      const res = await api.get(`/labs?keyword=${searchQuery}`);
      setLabs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLabs(keyword);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diagnostic Labs</h1>
          <p className="text-muted-foreground">Find and compare labs near you</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
          <Input 
            placeholder="Search by lab name or city..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full md:w-[300px]"
          />
          <Button type="submit" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse h-48 bg-muted/50" />
          ))}
        </div>
      ) : labs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No labs found. Try a different search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <Card key={lab._id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>{lab.labName}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {lab.city}, {lab.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Timings</span>
                  <span className="font-medium">{lab.operatingTimings?.open} - {lab.operatingTimings?.close}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Home Collection</span>
                  <span className="font-medium">{lab.homeCollectionAvailable ? 'Yes' : 'No'}</span>
                </div>
                <Link to={`/labs/${lab._id}`}>
                  <Button className="w-full mt-2">View Tests & Book</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
