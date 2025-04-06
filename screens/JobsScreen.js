import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getBookmarks, toggleBookmark } from './bookmarkStorage';
import { useTheme } from '../context/ThemeContext';

const JobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const navigation = useNavigation();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const API_URL = 'https://testapi.getlokalapp.com/common/jobs?page=1';

  // Set up custom header with theme switch
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerSwitchContainer}>
          <Text style={{ color: isDark ? '#fff' : '#000', marginRight: 6 }}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            thumbColor={isDark ? '#FFC107' : '#fff'}
            trackColor={{ false: '#888', true: '#666' }}
          />
        </View>
      ),
    });
  }, [navigation, isDark]);
  

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        const validJobs = json.results.filter(item => item && item.id);
        setJobs(validJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const stored = await getBookmarks();
    setBookmarkedIds(stored.map(job => job.id));
  };

  const handleBookmarkToggle = async (job) => {
    await toggleBookmark(job);
    loadBookmarks();
  };

  const renderItem = ({ item }) => {
    const salary = item.primary_details?.Salary;
    const place = item.primary_details?.Place;
    const experience = item.primary_details?.Experience;
    const isBookmarked = bookmarkedIds.includes(item.id);

    return (
      <View style={[styles.jobItem, { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          {item.title || 'Untitled Job'}
        </Text>
        <Text style={[styles.company, { color: isDark ? '#ccc' : '#333' }]}>
          Unknown Company
        </Text>
        <Text style={[styles.place, { color: isDark ? '#ccc' : '#555' }]}>
          {place ? `📍 ${place}` : 'Location not specified'}
        </Text>
        <Text style={[styles.salary, { color: isDark ? '#ccc' : '#666' }]}>
          {salary ? `💰 Salary: ${salary}` : 'Salary not specified'}
        </Text>
        <Text style={[styles.experience, { color: isDark ? '#ccc' : '#666' }]}>
          {experience ? `📅 Experience: ${experience}` : 'Experience not specified'}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate('JobDetail', { job: item })}
          >
            <Text style={styles.buttonText}>👁️ Detail</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.bookmarkButton,
              { backgroundColor: isBookmarked ? '#FFC107' : '#ddd' },
            ]}
            onPress={() => handleBookmarkToggle(item)}
          >
            <Text style={[styles.buttonText, { color: isBookmarked ? '#000' : '#333' }]}>
              {isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const keyExtractor = (item, index) =>
    item && item.id ? item.id.toString() : index.toString();

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <FlatList
        data={jobs}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={jobs.length === 0 && styles.centered}
        ListEmptyComponent={<Text>No jobs found.</Text>}
      />
    </View>
  );
};

export default JobsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  jobItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    marginBottom: 2,
  },
  place: {
    fontSize: 14,
    marginBottom: 2,
  },
  salary: {
    fontSize: 14,
    marginBottom: 8,
  },
  experience: {
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  bookmarkButton: {
    padding: 8,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
