import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';

import {
  Loading,
  Owner,
  IssueList,
  IssueFilters,
  IssueActions,
} from './styles';
import api from '../../services/api';
import Container from '../../components/Container';

const filters = [
  {
    name: 'All',
    value: 'all',
  },
  {
    name: 'Open',
    value: 'open',
  },
  {
    name: 'Closed',
    value: 'closed',
  },
];

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    filterSelected: 'all',
    page: 1,
  };

  async componentDidMount() {
    const { match } = this.props;

    const { filterSelected, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filterSelected,
          page,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleFilterClick = async index => {
    await this.setState({
      filterSelected: filters[index].value,
    });
    this.loadIssues();
  };

  hadleClickPage = async command => {
    const { page } = this.state;
    await this.setState({
      page: command === 'next' ? page + 1 : page - 1,
    });
    this.loadIssues();
  };

  async loadIssues() {
    const { match } = this.props;
    const { filterSelected, page } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const issues = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: filterSelected,
        page,
        per_page: 5,
      },
    });
    this.setState({
      issues: issues.data,
    });
  }

  render() {
    const { repository, issues, loading, filterSelected, page } = this.state;

    if (loading) {
      return <Loading>Carregando!</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Go Back</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <IssueFilters>
          {filters.map((filter, index) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => this.handleFilterClick(index)}
              disabled={filter.value === filterSelected}
            >
              {filter.name}
            </button>
          ))}
        </IssueFilters>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <IssueActions>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => this.hadleClickPage('previous')}
            title="Previous"
          >
            <FaArrowAltCircleLeft />
          </button>
          <button
            type="button"
            onClick={() => this.hadleClickPage('next')}
            title="Next"
          >
            <FaArrowAltCircleRight />
          </button>
        </IssueActions>
      </Container>
    );
  }
}
