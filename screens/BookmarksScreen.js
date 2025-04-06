import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Switch,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getBookmarks, removeBookmark } from './bookmarkStorage';
import { useTheme } from '../context/ThemeContext';

const BookmarksScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = themedStyles(isDark);
  const navigation = useNavigation();

  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

  // 🔄 Fetch bookmarks on screen focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const jobs = await getBookmarks();
        setBookmarkedJobs(jobs);
      };
      fetchData();
    }, [])
  );

  // 🧠 Add the toggle switch to the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={headerStyles.headerSwitchContainer}>
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

  const handleRemove = async (jobId) => {
    await removeBookmark(jobId);
    const jobs = await getBookmarks();
    setBookmarkedJobs(jobs);
  };

  const renderItem = ({ item }) => (
    <View style={styles.jobCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>📍 {item.primary_details?.Place || 'N/A'}</Text>

      <View style={styles.buttons}>
        <Button title="❌ Remove" onPress={() => handleRemove(item.id)} />
        <TouchableOpacity
          onPress={() => navigation.navigate('JobDetails', { job: item })}
        >
          <Text style={styles.link}>👁 View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!bookmarkedJobs.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookmarks yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>⭐ Bookmarked Jobs</Text>
      <FlatList
        data={bookmarkedJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default BookmarksScreen;

// 🌗 Theme-based styles
const themedStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
      color: isDark ? '#fff' : '#000',
    },
    jobCard: {
      backgroundColor: isDark ? '#1e1e1e' : '#f9f9f9',
      padding: 14,
      borderRadius: 12,
      marginBottom: 10,
      borderColor: isDark ? '#333' : '#ddd',
      borderWidth: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 4,
      color: isDark ? '#fff' : '#000',
    },
    text: {
      color: isDark ? '#ccc' : '#333',
    },
    buttons: {
      marginTop: 10,
    },
    link: {
      color: isDark ? '#66b3ff' : '#007bff',
      marginTop: 6,
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#121212' : '#fff',
    },
    emptyText: {
      fontSize: 16,
      color: isDark ? '#aaa' : '#666',
    },
  });

// 🧩 Header-specific styling
const headerStyles = StyleSheet.create({
  headerSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});
