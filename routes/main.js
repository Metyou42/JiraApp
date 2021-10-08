const { Router } = require('express');
const fetch = require('node-fetch');

const router = Router();

router.get('/', async (req, res) => {
  async function fetchApi(apiStr) {
    const fetchApiRes = await fetch(`https://${process.env.SITE}.atlassian.net/rest/api/3/${apiStr}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.BASIC_AUTH).toString('base64')}`,
        Accept: 'application/json',
      },
    })
      .then(response => response.text())
      .catch(err => console.error(err));

    return JSON.parse(fetchApiRes);
  }

  function createMainArr(allIsusses, status) {
    const mainArr = [];
    for (const i of allIsusses) {
      const nameOfMainArr = mainArr.map(i => i.name);
      if (!nameOfMainArr.includes(i.name)) {
        const statusOfMainArrs = {};
        for (const j of status) {
          let link = `https://${process.env.SITE}.atlassian.net/jira/software/c/projects/AN/issues/AN-1?jql=`;
          if (i.name === 'none') {
            link += encodeURI(`project = "${process.env.PROJECT}" AND status = "${j.toUpperCase()}" AND assignee = ${i.accountId} ORDER BY created DESC`);
          } else {
            link += encodeURI(`project = "${process.env.PROJECT}" AND status = "${j.toUpperCase()}" AND assignee IN ("${i.accountId}") ORDER BY created DESC`);
          }
          if (j === i.status) {
            statusOfMainArrs[j] = {
              value: 1,
              link,
            };
          } else {
            statusOfMainArrs[j] = {
              value: 0,
              link,
            };
          }
        }

        mainArr.push({
          name: i.name,
          isusses: statusOfMainArrs,
          accountId: i.accountId,
        });
      } else {
        for (let j = 0; j < mainArr.length; j++) {
          if (mainArr[j].name === i.name) {
            mainArr[j].isusses[i.status].value++;
          }
        }
      }
    }
    return mainArr;
  }

  function isussesDTO(issues) {
    const issuesDTO = issues.map(i => {
      const { displayName } = i.fields.assignee ? i.fields.assignee : { displayName: 'none' };
      const { accountId } = i.fields.assignee ? i.fields.assignee : { accountId: 'EMPTY' };

      return {
        name: displayName,
        status: i.fields.status.statusCategory.name,
        accountId,
      };
    });

    return issuesDTO;
  }

  const fetchStatus = await fetchApi('statuscategory');
  const status = fetchStatus.filter(i => i.id > 1).map(i => i.name);

  const fetchFilters = await fetchApi('filter');
  const filters = fetchFilters.map(i => i.jql);

  let featchSearchIssues;

  if (!req.query.filter || !filters.includes(req.query.filter)) {
    const { issues } = await fetchApi('search');
    featchSearchIssues = issues;
  } else if (filters.includes(req.query.filter)) {
    const { issues } = await fetchApi(`search?jql=${encodeURI(req.query.filter)}`);
    featchSearchIssues = issues;
  }

  const issuesDTO = isussesDTO(featchSearchIssues);
  const mainArr = createMainArr(issuesDTO, status);

  res.render('index', {
    title: 'Table',
    status,
    filters,
    mainArr,
  });
});

module.exports = router;
