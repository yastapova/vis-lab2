import csv
import numpy as np
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt

def write_csv(headings, data_list):
	"""Write cleaned data to a new csv file."""
	print('writing cleaned data', flush=True)
	filename = 'communities_crime_clean.csv'
	with open(filename,'w',newline='') as f:
		writer = csv.writer(f,delimiter=',')
		writer.writerow(headings)
		for r in data_list:
			writer.writerow(r)
	print('wrote to:    communities_crime_clean.csv')

def quantify():
	"""Convert some text categorical variables to numbers."""
	print('\tconverting text data', flush=True)
	with open('communities_crime_reduced.csv','r') as f:
		reader = csv.reader(f)
		data_list = list(reader)

	headings = data_list.pop(0)

	source_mort = {}
	mort_count = 0
	source_inc = {}
	inc_count = 0
	for i in range(0,len(data_list)):
		dp = data_list[i]
		if(dp[21] in source_mort):
			dp[21] = source_mort[dp[21]]
		else:
			source_mort[dp[21]] = mort_count
			dp[21] = mort_count
			mort_count += 1
		if(dp[28] in source_inc):
			dp[28] = source_inc[dp[28]]
		else:
			source_inc[dp[28]] = inc_count
			dp[28] = inc_count
			inc_count += 1
	print('\tdone', flush=True)

	return headings, data_list

def fill_in_nan(data_list):
	"""Fill in np.nan for any blanks in the data."""
	print('\tfilling in NaN for blanks', flush=True)
	for i in range(0,len(data_list)):
		for j, val in enumerate(data_list[i]):
			if val == '':
				data_list[i][j] = np.nan
	print('\tdone', flush=True)
	return data_list

def fill_in_means(data_list):
	"""Fill in column means for NaNs in the data."""
	print('\tfilling in column means for NaNs', flush=True)
	means = np.nanmean(data_list, axis = 0)
	# print(means)
	for i in range(0,len(data_list)):
		fill = np.isnan(data_list[i])
		data_list[i][fill] = means[fill]
	print('\tdone', flush=True)
	return data_list

def clean():
	"""Run all of the functions to clean the data."""
	print('beginning data cleaning', flush=True)
	headings, data_list = quantify()
	data_list = fill_in_nan(data_list)
	print('done', flush=True)
	write_csv(headings, data_list)

def make_scree(x, n_x, title):
	"""Create a scree plot."""
	x_list = np.arange(n_x)
	y_labels = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
	plt.bar(x_list, x, align='center')
	plt.xticks(x_list, x_list)
	plt.yticks(y_labels, [i*100 for i in y_labels])
	plt.ylabel('Variance Explained (%)')
	plt.xlabel('Principal Component')
	plt.title(title + ' Scree Plot')
	plt.draw()
	plt.show(block = False)
	plt.pause(0.001)
	_ = input('Continue [enter]? ')

def run_pca():
	"""Runs principal component analysis on the data."""
	print('beginning analysis', flush=True)
	n_comps = 10
	data_list = np.loadtxt('communities_crime_clean.csv', delimiter=',', skiprows=1)
	data_list = fill_in_means(data_list)
	
	data_list = np.delete(data_list, np.s_[0], axis = 1)

	pca = PCA(n_components=n_comps)
	pca.fit(data_list)

	x_list = np.arange(n_comps)
	y_labels = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
	plt.bar(x_list, pca.explained_variance_ratio_, align='center', width=0.25)
	plt.xticks(x_list, x_list)
	plt.yticks(y_labels, [i*100 for i in y_labels])
	plt.ylabel('Variance Explained (%)')
	plt.xlabel('Principal Component')
	plt.title('PCA Scree Plot')
	plt.draw()
	plt.show(block = False)
	plt.pause(0.001)
	_ = input('Continue [enter]? ')

	# make_scree(pca.explained_variance_ratio_, n_comps, 'PCA')

	keep_PCs = pca.components_[0:3]
	keep_PCs = np.array([[abs(x) for x in y] for y in keep_PCs])
	# print(keep_PCs)
	sums = np.sum(keep_PCs,axis=1)
	keep_PCs = np.array([keep_PCs[i]/sums[i] for i in range(0,len(sums))])
	# print(keep_PCs)

	for i in range(0,len(keep_PCs)):
		make_scree(keep_PCs[i], len(keep_PCs[i]), 'PC ' + str(i))

	new_attr = np.array([(-1, -1)],dtype=[('index', int),('value', float)])
	for x in keep_PCs:
		y = [(i,x[i]) for i in range(0, len(x))]
		y = np.array(y, dtype=[('index', int),('value', float)])
		new_attr = np.hstack((new_attr,y))
		
	new_attr = new_attr[1:len(new_attr)]
	new_attr = np.sort(new_attr, order='value')

	# print(new_attr)
	attr_set = set()
	num_attr = 15
	i = len(new_attr)-1
	while(len(attr_set) < num_attr and i > -1):
		tup = new_attr[i]
		attr_set.add(tup[0])
		i -= 1

	print('done', flush=True)
	print('keep attributes:')
	print(sorted(attr_set))

if __name__ == '__main__':
	clean()
	run_pca()

