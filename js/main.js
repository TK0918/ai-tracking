// DOM 元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化抽屉功能
  initDrawer();
  // 初始化模态框功能
  initModal();
  // 初始化规则表单功能
  initRuleForm();
  // 初始化拖拽排序功能
  initDraggable();
  // 初始化搜索功能
  initSearch();
  // 初始化轨迹处理规则功能
  initTrackingRules();
});

/**
 * 初始化抽屉面板功能
 */
function initDrawer() {
  // 获取所有打开抽屉的按钮
  const openButtons = document.querySelectorAll('[data-drawer-target]');
  // 获取所有关闭抽屉的按钮
  const closeButtons = document.querySelectorAll('[data-drawer-close]');
  // 获取抽屉背景遮罩
  const backdrop = document.querySelector('.drawer-backdrop');

  // 添加打开抽屉事件
  openButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-drawer-target');
      const drawer = document.getElementById(targetId);
      
      if (drawer) {
        drawer.classList.add('open');
        backdrop.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
      }
    });
  });

  // 添加关闭抽屉事件
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const drawer = this.closest('.drawer');
      if (drawer) {
        drawer.classList.remove('open');
        backdrop.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
      }
    });
  });

  // 点击背景遮罩关闭抽屉
  if (backdrop) {
    backdrop.addEventListener('click', function() {
      const openDrawer = document.querySelector('.drawer.open');
      if (openDrawer) {
        openDrawer.classList.remove('open');
        backdrop.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * 初始化模态框功能
 */
function initModal() {
  // 获取所有打开模态框的按钮
  const openButtons = document.querySelectorAll('[data-modal-target]');
  // 获取所有关闭模态框的按钮
  const closeButtons = document.querySelectorAll('[data-modal-close]');

  // 添加打开模态框事件
  openButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      
      if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
      }
    });
  });

  // 添加关闭模态框事件
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // 恢复背景滚动
      }
    });
  });

  // 点击模态框背景关闭模态框
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  });
}

/**
 * 初始化规则表单功能
 */
function initRuleForm() {
  // 关键词屏蔽添加功能
  const blockKeywordsContainer = document.getElementById('block-keywords-container');
  const addBlockKeywordBtn = document.getElementById('add-block-keyword');

  if (addBlockKeywordBtn && blockKeywordsContainer) {
    addBlockKeywordBtn.addEventListener('click', function() {
      const newItem = document.createElement('div');
      newItem.className = 'flex items-center gap-2 mb-2';
      newItem.innerHTML = `
        <input type="text" class="form-control" placeholder="输入关键词">
        <button type="button" class="btn btn-danger btn-sm remove-item">删除</button>
      `;
      blockKeywordsContainer.appendChild(newItem);
      
      // 添加删除按钮事件
      newItem.querySelector('.remove-item').addEventListener('click', function() {
        blockKeywordsContainer.removeChild(newItem);
      });
    });
  }

  // 关键词替换添加功能
  const replaceKeywordsContainer = document.getElementById('replace-keywords-container');
  const addReplaceKeywordBtn = document.getElementById('add-replace-keyword');

  if (addReplaceKeywordBtn && replaceKeywordsContainer) {
    addReplaceKeywordBtn.addEventListener('click', function() {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" class="form-control" placeholder="原词"></td>
        <td><input type="text" class="form-control" placeholder="替换词"></td>
        <td><button type="button" class="btn btn-danger btn-sm remove-row">删除</button></td>
      `;
      replaceKeywordsContainer.appendChild(newRow);
      
      // 添加删除按钮事件
      newRow.querySelector('.remove-row').addEventListener('click', function() {
        replaceKeywordsContainer.removeChild(newRow);
      });
    });
  }

  // 物流节点添加功能
  const trackingNodesContainer = document.getElementById('tracking-nodes-container');
  const addTrackingNodeBtn = document.getElementById('add-tracking-node');

  if (addTrackingNodeBtn && trackingNodesContainer) {
    addTrackingNodeBtn.addEventListener('click', function() {
      const newNode = document.createElement('li');
      newNode.className = 'draggable-item';
      newNode.innerHTML = `
        <div class="w-100">
          <div class="flex gap-2 mb-2">
            <input type="text" class="form-control" placeholder="节点时间" onfocus="(this.type='datetime-local')">
            <input type="text" class="form-control" placeholder="地点">
          </div>
          <input type="text" class="form-control" placeholder="状态文本">
        </div>
        <button type="button" class="btn btn-danger btn-sm remove-node">删除</button>
      `;
      trackingNodesContainer.appendChild(newNode);
      
      // 添加删除按钮事件
      newNode.querySelector('.remove-node').addEventListener('click', function() {
        trackingNodesContainer.removeChild(newNode);
      });

      // 重新初始化拖拽功能
      initDraggable();
    });
  }

  // 表单预览按钮功能
  const previewRuleBtn = document.getElementById('preview-rule');
  if (previewRuleBtn) {
    previewRuleBtn.addEventListener('click', function() {
      generateRulePreview();
    });
  }
}

/**
 * 生成规则预览
 */
function generateRulePreview() {
  const previewModal = document.getElementById('preview-modal');
  if (!previewModal) return;
  
  const ruleNameInput = document.getElementById('rule-name');
  const ruleName = ruleNameInput ? ruleNameInput.value : '未命名规则';
  
  const previewContent = document.querySelector('#preview-modal .modal-body');
  if (!previewContent) return;
  
  // 模拟原始轨迹数据
  const originalTrackingData = [
    {
      date: '2023-10-15 14:30',
      location: 'Shanghai, China',
      status: 'Package has been shipped'
    },
    {
      date: '2023-10-13 09:15',
      location: 'Guangzhou, China',
      status: 'Arrived at sorting facility'
    },
    {
      date: '2023-10-10 18:45',
      location: 'Shenzhen, China',
      status: 'Order processed'
    }
  ];
  
  // 应用规则处理轨迹
  const processedTrackingData = processTrackingData(originalTrackingData);
  
  // 获取公司重命名
  const companyRename = document.getElementById('company-rename');
  const originalCompany = 'Yanwen Express';
  const newCompany = companyRename && companyRename.value ? 
                    companyRename.value.split('→')[1]?.trim() || 'Global Express' : 
                    'Global Express';
  
  // 构建预览内容
  previewContent.innerHTML = `
    <h3>${ruleName}</h3>
    
    <div class="card mb-4">
      <h4>原始物流轨迹</h4>
      <div class="mb-2">
        <span><strong>物流公司：</strong>${originalCompany}</span><br>
        <span><strong>物流单号：</strong>YT1234567890</span>
      </div>
      <div class="tracking-timeline">
        ${originalTrackingData.map(item => `
          <div class="tracking-item">
            <div class="tracking-date">${item.date}</div>
            <div class="tracking-location">${item.location}</div>
            <div class="tracking-status">${item.status}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="card">
      <h4>应用规则后的轨迹</h4>
      <div class="mb-2">
        <span><strong>物流公司：</strong>${newCompany}</span><br>
        <span><strong>物流单号：</strong>GE7890123456</span>
      </div>
      <div class="tracking-timeline">
        ${processedTrackingData.map(item => `
          <div class="tracking-item">
            <div class="tracking-date">${item.date}</div>
            <div class="tracking-location">${item.location}</div>
            <div class="tracking-status">${item.status}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  previewModal.classList.add('show');
}

/**
 * 应用规则处理轨迹数据
 * @param {Array} originalData - 原始轨迹数据
 * @returns {Array} - 处理后的轨迹数据
 */
function processTrackingData(originalData) {
  let processedData = [...originalData];
  
  // 处理首条轨迹规则
  processRulesByType(processedData, 'first-tracking-rules', true, false);
  
  // 处理非首条轨迹规则
  processRulesByType(processedData, 'non-first-tracking-rules', false, true);
  
  // 处理全部轨迹规则
  processRulesByType(processedData, 'all-tracking-rules', true, true);
  
  // 应用时间偏移
  applyTimeOffset(processedData);
  
  // 过滤掉隐藏的轨迹
  processedData = processedData.filter(item => !item.hidden);
  
  return processedData;
}

/**
 * 根据规则类型处理轨迹
 * @param {Array} data - 轨迹数据
 * @param {string} containerId - 规则容器ID
 * @param {boolean} includeFirst - 是否包含首条轨迹
 * @param {boolean} includeNonFirst - 是否包含非首条轨迹
 */
function processRulesByType(data, containerId, includeFirst, includeNonFirst) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const rules = container.querySelectorAll('.card');
  
  rules.forEach(rule => {
    const matchText = rule.querySelector('input[placeholder="输入要匹配的文字"]')?.value;
    if (!matchText) return;
    
    const processType = rule.querySelector('.process-type')?.value;
    if (!processType) return;
    
    data.forEach((item, index) => {
      // 检查是否应该应用规则到这个轨迹
      const isFirst = index === 0;
      if ((isFirst && !includeFirst) || (!isFirst && !includeNonFirst)) return;
      
      // 检查轨迹是否包含匹配文本
      const itemText = `${item.location} ${item.status}`.toLowerCase();
      if (!itemText.includes(matchText.toLowerCase())) return;
      
      // 应用处理
      if (processType === 'hide') {
        item.hidden = true;
      } else if (processType === 'modify-part') {
        const fieldToModify = rule.querySelector('.modify-part-options select')?.value;
        const newText = rule.querySelector('.modify-part-options input')?.value;
        
        if (fieldToModify && newText) {
          if (fieldToModify === 'location') {
            item.location = newText;
          } else if (fieldToModify === 'status') {
            item.status = newText;
          }
        }
      } else if (processType === 'replace-all') {
        const newLocation = rule.querySelector('.replace-all-options input[placeholder="替换地点"]')?.value;
        const newStatus = rule.querySelector('.replace-all-options input[placeholder="替换状态"]')?.value;
        
        if (newLocation) item.location = newLocation;
        if (newStatus) item.status = newStatus;
      }
    });
  });
}

/**
 * 应用时间偏移
 * @param {Array} data - 轨迹数据
 */
function applyTimeOffset(data) {
  const offsetDirection = document.getElementById('time-offset-direction')?.value;
  const offsetDays = parseInt(document.getElementById('time-offset-days')?.value || '0');
  
  if (!offsetDirection || isNaN(offsetDays) || offsetDays === 0) return;
  
  const multiplier = offsetDirection === 'delay' ? 1 : -1;
  const offsetMilliseconds = offsetDays * 24 * 60 * 60 * 1000 * multiplier;
  
  data.forEach(item => {
    if (item.hidden) return;
    
    const date = new Date(item.date);
    if (!isNaN(date.getTime())) {
      date.setTime(date.getTime() + offsetMilliseconds);
      item.date = formatDate(date);
    }
  });
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化后的日期字符串
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 初始化轨迹处理规则功能
 */
function initTrackingRules() {
  // 处理首条轨迹规则
  initRuleSection('first-tracking-rules', 'add-first-rule', '当首条轨迹包含：');
  
  // 处理非首条轨迹规则
  initRuleSection('non-first-tracking-rules', 'add-non-first-rule', '当非首条轨迹包含：');
  
  // 处理全部轨迹规则
  initRuleSection('all-tracking-rules', 'add-all-rule', '当任意轨迹包含：');
  
  // 为所有已存在的处理方式选择器添加事件
  document.querySelectorAll('.process-type').forEach(setupProcessTypeEvents);
}

/**
 * 初始化特定类型轨迹规则部分
 * @param {string} containerId - 规则容器ID
 * @param {string} addBtnId - 添加按钮ID
 * @param {string} ruleTitle - 规则标题文本
 */
function initRuleSection(containerId, addBtnId, ruleTitle) {
  const container = document.getElementById(containerId);
  const addBtn = document.getElementById(addBtnId);
  
  if (!container || !addBtn) return;
  
  // 为已有的删除按钮添加事件
  container.querySelectorAll('.remove-rule').forEach(btn => {
    btn.addEventListener('click', function() {
      const ruleCard = this.closest('.card');
      if (ruleCard && container) {
        container.removeChild(ruleCard);
      }
    });
  });
  
  // 添加新规则按钮事件
  addBtn.addEventListener('click', function() {
    const newRule = document.createElement('div');
    newRule.className = 'card mb-2';
    newRule.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <strong>${ruleTitle}</strong>
        <button type="button" class="btn btn-danger btn-sm remove-rule">删除</button>
      </div>
      <input type="text" class="form-control mb-2" placeholder="输入要匹配的文字">
      <div class="form-group">
        <label class="form-label">处理方式：</label>
        <select class="form-control process-type mb-2">
          <option value="hide">隐藏轨迹</option>
          <option value="modify-part">修改部分内容</option>
          <option value="replace-all">替换全部内容</option>
        </select>
        
        <div class="modify-part-options" style="display: none;">
          <div class="flex gap-2 mb-2">
            <select class="form-control">
              <option value="location">地点</option>
              <option value="status">状态</option>
            </select>
            <input type="text" class="form-control" placeholder="替换为">
          </div>
        </div>
        
        <div class="replace-all-options" style="display: none;">
          <input type="text" class="form-control mb-2" placeholder="替换地点">
          <input type="text" class="form-control" placeholder="替换状态">
        </div>
      </div>
    `;
    
    container.appendChild(newRule);
    
    // 为新添加的规则设置事件
    const removeBtn = newRule.querySelector('.remove-rule');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        container.removeChild(newRule);
      });
    }
    
    // 为新添加的处理方式选择器添加事件
    const processTypeSelector = newRule.querySelector('.process-type');
    if (processTypeSelector) {
      setupProcessTypeEvents(processTypeSelector);
    }
  });
}

/**
 * 为处理方式选择器设置事件
 * @param {Element} selector - 处理方式选择器元素
 */
function setupProcessTypeEvents(selector) {
  selector.addEventListener('change', function() {
    const parentDiv = this.closest('.form-group');
    if (!parentDiv) return;
    
    const modifyPartOptions = parentDiv.querySelector('.modify-part-options');
    const replaceAllOptions = parentDiv.querySelector('.replace-all-options');
    
    // 隐藏所有选项
    if (modifyPartOptions) modifyPartOptions.style.display = 'none';
    if (replaceAllOptions) replaceAllOptions.style.display = 'none';
    
    // 根据选择显示相应选项
    if (this.value === 'modify-part' && modifyPartOptions) {
      modifyPartOptions.style.display = 'block';
    } else if (this.value === 'replace-all' && replaceAllOptions) {
      replaceAllOptions.style.display = 'block';
    }
  });
  
  // 触发初始状态
  selector.dispatchEvent(new Event('change'));
}

/**
 * 初始化拖拽排序功能
 */
function initDraggable() {
  const draggableList = document.getElementById('tracking-nodes-container');
  if (!draggableList) return;

  let draggedItem = null;

  // 为每个可拖拽项添加事件
  const items = draggableList.querySelectorAll('.draggable-item');
  items.forEach(item => {
    // 拖拽开始
    item.addEventListener('dragstart', function() {
      draggedItem = this;
      setTimeout(() => {
        this.style.opacity = '0.5';
      }, 0);
    });

    // 拖拽结束
    item.addEventListener('dragend', function() {
      draggedItem = null;
      this.style.opacity = '1';
    });

    // 设置可拖拽属性
    item.setAttribute('draggable', 'true');

    // 拖拽经过其他元素
    item.addEventListener('dragover', function(e) {
      e.preventDefault();
    });

    // 放置
    item.addEventListener('drop', function(e) {
      e.preventDefault();
      if (this !== draggedItem) {
        // 获取拖拽项和目标项的位置
        let allItems = Array.from(draggableList.querySelectorAll('.draggable-item'));
        let draggedIndex = allItems.indexOf(draggedItem);
        let targetIndex = allItems.indexOf(this);

        // 根据拖拽方向调整位置
        if (draggedIndex < targetIndex) {
          draggableList.insertBefore(draggedItem, this.nextSibling);
        } else {
          draggableList.insertBefore(draggedItem, this);
        }
      }
    });
  });
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchForm = document.getElementById('tracking-search-form');
  const searchInput = document.getElementById('tracking-number');
  const searchResults = document.getElementById('search-results');
  const emptyState = document.getElementById('empty-state');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const trackingNumber = searchInput.value.trim();
      
      if (trackingNumber) {
        // 模拟搜索结果
        if (trackingNumber.length >= 8) {
          if (searchResults) {
            searchResults.style.display = 'block';
          }
          if (emptyState) {
            emptyState.style.display = 'none';
          }
        } else {
          if (searchResults) {
            searchResults.style.display = 'none';
          }
          if (emptyState) {
            emptyState.style.display = 'block';
          }
        }
      }
    });
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  
  // 显示复制成功提示
  alert('复制成功!');
}

/**
 * 语言切换功能
 */
function switchLanguage(lang) {
  // 实际项目中这里应该切换不同语言的文本
  document.documentElement.setAttribute('lang', lang);
  
  // 这里可以添加更多语言切换逻辑
  // 如重新加载页面或替换文本内容
}

/**
 * 删除规则确认
 * @param {string} ruleName - 规则名称
 */
function confirmDeleteRule(ruleName) {
  if (confirm(`确定要删除规则 "${ruleName}" 吗？`)) {
    // 这里添加删除规则的逻辑
    alert('规则已删除');
    // 刷新规则列表
    // refreshRuleList();
  }
} 